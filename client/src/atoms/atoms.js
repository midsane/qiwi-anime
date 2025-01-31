import { atom } from "recoil";
const latestArticleAtom = atom({
  key: "latestArticleAtom",
  default: [],
});

const CurrentPageArticlesAtom = atom({
  key: "CurrentPageArticlesAtom",
  default: [],
});

const articleIntroAtom = atom({
  key: "articleIntroAtom",
  default: "",
});

const articleTitleAtom = atom({
  key: "articleTitleAtom",
  default: "",
});

const articleBannerImgLinkAtom = atom({
  key: "articleBannerImgLinkAtom",
  default: "",
});

const toastMsgAtom = atom({
  key: "toastMsgAtom",
  default: ""
})

const articleListAtom = atom({
  key: "articleListAtom",
  default: []
})

const numberOfArticlesAtom = atom({
  key: "numbersOfArticlesAtom",
  default: 0
})

export {
  latestArticleAtom,
  CurrentPageArticlesAtom,
  articleIntroAtom,
  articleTitleAtom,
  articleBannerImgLinkAtom,
  toastMsgAtom,
  articleListAtom,
  numberOfArticlesAtom
};
