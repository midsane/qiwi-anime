import cors from "cors";
import express from "express";
import { Article } from "./models/article.model.js";
import { Anime } from "./models/anime.js";
import { ApiResponse } from "./utils/apiresponse.js";
import ApiError from "./utils/apierror.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./utils/asyncHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "17kb" }));
app.use(express.static("public"));

function getExactTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new ApiError(400, "User Unauthorized");
  }
  try {
    jwt.verify(token, process.env.ADMIN_SECRET);
  } catch (error) {
    throw new ApiError(400, error.message || "User Unauthorized");
  }
  next();
};

app.get("/ping", (req,res) => {
  const time = getExactTime();
  console.log(`got successfully pinged at ${time}`);
  res.status(201).json({ msg: `got successfully pinged at ${time}` });
});

app.post("/admin", verifyToken, (req, res) => {
  res.status(201).json({ msg: "ok", status: 201 });
});

app.delete("/delete-anime/:name", verifyToken, asyncHandler(async(req, res) => {
  const {name} = req.params
  const data = await Anime.deleteOne({name});
  if(!data) throw new ApiError(500, "could not delete anime");
   res
     .status(201)
     .json(new ApiResponse(200, name, "Anime deleted successfully"));
}))

app.post(
  "/add-anime",
  verifyToken,
  asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const name = data.name;
      const doesItExist = await Anime.find({ name });
      if (doesItExist && doesItExist.length > 0) {
        return res
          .status(201)
          .json(new ApiResponse(400, {}, "this Anime already exist"));
      }
      const newAnime = await Anime.create(data);
      if (!newAnime) {
        throw new ApiError(500, error.message || "could not create anime");
      }
      res
        .status(201)
        .json(new ApiResponse(200, newAnime, "new Anime created successfully"));
    } catch (error) {
      throw new ApiError(500, error.message || "could not create anime");
    }
  })
);

app.post(
  "/add-article",
  verifyToken,
  asyncHandler(async (req, res) => {
    const data = req.body;
    try {
      const newArticle = await Article.create(data);
      if (!newArticle) {
        throw new ApiError(500, "could not create new article");
      }

      res
        .status(201)
        .json(
          new ApiResponse(200, newArticle, "created new article successfully")
        );
    } catch (error) {
      throw new ApiError(500, error.message || "could not create anime");
    }
  })
);

app.post(
  "/get-all-anime",
  asyncHandler(async (req, res) => {
    const typedName = req.query.name || "";
    try {
      const allAnimes = await Anime.find({
        name: { $regex: typedName, $options: "i" },
      }).select("name imageLinks");

      if (!allAnimes) {
        throw new ApiError(500, "could not find all animes");
      }

      res
        .status(201)
        .json(
          new ApiResponse(200, allAnimes, "fetched all the animes successfully")
        );
    } catch (error) {
      throw new ApiError(500, error.message || "could not create anime");
    }
  })
);

app.get(
  "/get-number-of-article",
  asyncHandler(async (req, res) => {
    try {
      const allArticles = await Article.find({});
      res
        .status(201)
        .json(
          new ApiResponse(
            200,
            allArticles.length,
            "fetched all articles size successfully"
          )
        );
    } catch (error) {
      throw new ApiError(500, error.message || "could not fetch article size");
    }
  })
);

app.get(
  "/get-all-article",
  asyncHandler(async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit);

    if (offset < 0 || (limit && limit <= 0)) {
      throw new ApiError(400, "Invalid offset or limit value");
    }

    try {
      
      const totalArticles = await Article.countDocuments();

      if (!limit) {
        limit = totalArticles - offset;
        if (limit < 0) limit = 0; 
      }

      const allArticles = await Article.find({})
        .skip(offset)
        .limit(limit)
        .select("bannerImgLink title intro");

      if (!allArticles) {
        throw new ApiError(500, "Could not find articles");
      }

      res.status(200).json(
        new ApiResponse(
          200,
          allArticles,
          "Fetched all the articles successfully"
        )
      );
    } catch (error) {
      throw new ApiError(
        500,
        error.message || error.msg || "Could not fetch articles"
      );
    }
  })
);


app.post(
  "/article/:title",
  asyncHandler(async (req, res) => {
    const { title } = req.params;

    try {
      const articleData = await Article.aggregate([
        {
          $match: {
            title,
          },
        },
        {
          $lookup: {
            from: "animes",
            localField: "List",
            foreignField: "name",
            as: "List",
            pipeline: [
              {
                $lookup: {
                  from: "articles",
                  localField: "recTitle",
                  foreignField: "title",
                  as: "recTitle",
                  pipeline: [
                    {
                      $project: {
                        title: 1,
                        intro: 1,
                        bannerImgLink: 1,
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  recTitle: {
                    title: { $arrayElemAt: ["$recTitle.title", 0] },
                    intro: { $arrayElemAt: ["$recTitle.intro", 0] },
                    bannerImgLink: {
                      $arrayElemAt: ["$recTitle.bannerImgLink", 0],
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      if (!articleData) {
        throw new ApiError(500, "could not find article details");
      }

      res
        .status(201)
        .json(
          new ApiResponse(
            200,
            articleData,
            "fetched the details of the articles successfully"
          )
        );
    } catch (error) {
      throw new ApiError(
        500,
        error.message || "could not find article details"
      );
    }
  })
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (
    email != process.env.ADMIN_EMAIL ||
    password != process.env.ADMIN_PASSWORD
  ) {
    return res
      .status(403)
      .json(new ApiResponse(403, {}, "invalid credentials"));
  }

  const jwtToken = jwt.sign(
    {
      email,
      password,
    },
    process.env.ADMIN_SECRET
  );

  res
    .status(201)
    .json(new ApiResponse(200, jwtToken, "signed in successfully"));
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json(
      new ApiResponse(
        err.statusCode || 500,
        {},
        err.message || "internal server error"
      )
    );
});

export { app };
