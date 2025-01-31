import {
    Plus, Save, Workflow, Eraser, Circle, Check, Search,
    Trash
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { redirect } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { articleBannerImgLinkAtom, articleIntroAtom, articleListAtom, articleTitleAtom, toastMsgAtom } from "../atoms/atoms";
import { Button, Input, LinkTag, Tab, Tags } from "../components/utilityComponent";
import { AdminLoader } from "../components/loader";


export const Loader = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return redirect("/");
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}admin`, {
            method: "POST",
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return redirect("/");
        }

        if (response.status >= 300) {
            return redirect("/");
        }

        const data = await response.json();

        if (data.statusCode >= 300) {
            return redirect("/");
        }


        return { status: 200, msg: "ok" };
    } catch (error) {

        console.error("Error in loader:", error);
        return redirect("/");
    }
};

export function AdminPage() {

    return (<div className="flex flex-col md:flex-row min-w-full justify-center items-center gap-8">
        <ArticleMenu />
        <Post />
    </div>)
}

const ArticleMenu = () => {

    const [tab, setTab] = useState(1);
    const [loading, setLoading] = useState(false)
    const articleAnime = useRecoilValue(articleListAtom)
    const [allAnime, setAllAnime] = useState([])
    const setToastmsg = useSetRecoilState(toastMsgAtom)
    const [title, setTitle] = useRecoilState(articleTitleAtom)
    const [bannerImgLink, setBannerImgLink] = useRecoilState(articleBannerImgLinkAtom)
    const [intro, setIntro] = useRecoilState(articleIntroAtom)
    const [searchAnime, setSearchAnime] = useState("")
    const [debounce, setDebounce] = useState(Date.now())
    const [animeLoading, setAnimeLoading] = useState(false)
    useEffect(() => {
        setAnimeLoading(true)
        const getAllanimes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}get-all-anime/?name=${searchAnime}`, {
                    method: "POST",
                });
                if (!response.ok || response.status >= 300) {
                    setToastmsg(response.message || "something went wrong")
                }
                const data = await response.json();
                if (data.statusCode >= 300) {
                    setToastmsg(data.data)
                }
                setAllAnime(data.message)
                setAnimeLoading(false)
            } catch (error) {
                setToastmsg(error)
                setAnimeLoading(false)
            }

        }
        getAllanimes();

    }, [debounce])

    const ChangeDebounce = () => {
        const currentTime = Date.now();

        if (currentTime - debounce >= 500) {
            setDebounce(currentTime)

        }

    }

    useEffect(() => {
        ChangeDebounce()
    }, [searchAnime])

    const getBannerImg = async () => {
        setLoading(true)
        if (title.length <= 18) {
            setToastmsg("invalid article title");
            setLoading(false)
            return;
        }
        const animeName = title.slice(19, title.length);
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`)

        const data = await response.json();
        if (!data) {
            setToastmsg("something went wrong in fetching banner img")
            setLoading(false)
            return;
        }
        const info = data?.data[0]?.attributes
        if (!info) {
            setToastmsg("something went wrong in fetching banner img")
            setLoading(false)
            return;
        }
        setLoading(false)
        setBannerImgLink(info.coverImage.large || info.coverImage.original)

    }

    return (<div className="flex justify-center items-center flex-col min-w-[40vw] max-w-screen max-h-screen p-10 rounded bg-dark gap-2">
        {loading && <AdminLoader />}
        <Input limitSize={false} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <div className="max-w-32 flex gap-1 justify-center items-center" >
            <Input size="small" limitSize={false} value={bannerImgLink} onChange={(e) => setBannerImgLink(e.target.value)} placeholder="bannerImgLink" />
            <div className="mt-2 cursor-pointer active:scale-90 hover:scale-105 bg-dark flex justify-center h-fit w-fit items-center border rounded p-1" onClick={getBannerImg} ><Workflow color="orange" size={20} /></div>
        </div>

        <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="intro"
            name="intro"
            className="px-2 py-1 rounded w-56"
        >
        </textarea>
        <div className="w-56 rounded  justify-between bg-secondary flex">
            <div className="w-12 p-2 rounded cursor-pointer bg-primary " onClick={ChangeDebounce} ><Search color="black" /></div>
            <input className="bg-secondary rounded w-40 text-desc p-2" placeholder="search.." value={searchAnime} onChange={(e) => setSearchAnime(e.target.value)} />            
        </div>

        <div className="flex w-56">
            <Tab handleClick={setTab} tab={tab} goto={1} val="Article's anime" />
            <Tab handleClick={setTab} tab={tab} goto={2} val="All animes" />
        </div>

        {tab === 1 ? <ShowAnimes tab={tab} List={articleAnime} /> : <ShowAnimes animeLoading={animeLoading} tab={tab} List={allAnime} />}

    </div>)
}


const ShowAnimes = ({ animeLoading = false, List, tab }) => {
    const title = useRecoilValue(articleTitleAtom)
    const bannerImgLink = useRecoilValue(articleBannerImgLinkAtom)
    const intro = useRecoilValue(articleIntroAtom)
    const [loading, setLoading] = useState(false)
    const setToastMsg = useSetRecoilState(toastMsgAtom)

    const handleClick = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        try {
            const listData = List.map(l => l.name)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}add-article`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ title, bannerImgLink, intro, List: listData })
            })

            const data = await response.json()
            if (data.statusCode >= 300) {

                setToastMsg(data.data || "could not save article")
                setLoading(false)
                return
            }
            setToastMsg("successfully save the article " + data.message.title)
            setLoading(false)
        } catch (error) {
            setToastMsg(error.message || "could not save article")
            setLoading(false)
        }
    }

    return <div className="bg-dark  py-2 min-w-60 rounded text-desc text-md flex flex-col gap-2  overflow-y-scroll">
        {animeLoading && <AdminLoader />}
        {List.length === 0 && (
            <>
                <svg className="m-auto rounded" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 200 200">
                    <style>
                        {`.icon { fill: #ffd10f; }
                  .text { font-family: Arial, sans-serif; font-size: 16px; fill: #ffffff; }`}
                    </style>
                    <rect width="200" height="200" fill="#333333" rx="10" ry="10" />
                    <g transform="translate(50, 50)">
                        <path className="icon" d="M95 71V85C95 87.76 92.76 90 90 90H10C7.24 90 5 87.76 5 85V15C5 12.24 7.24 10 10 10H90C92.76 10 95 12.24 95 15V29L100 24V15C100 9.48 95.52 5 90 5H10C4.48 5 0 9.48 0 15V85C0 90.52 4.48 95 10 95H90C95.52 95 100 90.52 100 85V66L95 71ZM50 20L35 35H45V55H55V35H65L50 20ZM95 31.85L80.85 46H95V31.85ZM95 51H75V66H95V51Z" />
                    </g>
                    <text x="100" y="170" textAnchor="middle" className="text text-desc">No Animes Found</text>
                </svg>
            </>
        )}


        {List.map((l, i) => <AnimeTab key={i} l={l} />)}
        <div><p>Total count: {List.length}</p></div>
        {tab === 1 && <Button disabled={loading} placeholder={loading ? "Submitting" : "Submit"} handleClick={handleClick} />}
    </div>
}

const AnimeTab = ({ l }) => {
    const articleList = useRecoilValue(articleListAtom)
    const inArticle = articleList.some(anime => anime.name === l.name)
    const [loading, setLoading] = useState(false)
    const setToastMsg = useSetRecoilState(toastMsgAtom)

    const handleDelete = async () => {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}delete-anime/${l.name}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
                'Content-Type': "application/json"
            }
        })
        const data = await response.json();
        if (data.statusCode >= 300) {
            setLoading(false);
            setToastMsg("could not delete " + l.name + data.data);
            return;
        }
        setToastMsg('successfully deleted ' + l.name);
        setLoading(false)

    }

    return (<div className="flex gap-2 bg-secondary rounded">
        {loading && <AdminLoader />}
        <img 
        loading='lazy'
        className="w-1/3 h-14 object-cover rounded" src={l.imageLinks[0]} />
        <div className="flex flex-col gap-2 w-full">
            {l.name.length > 15 ? <p>{l.name.slice(0, 15)}...</p> : <p>{l.name}</p>}
            <div className="flex justify-between w-[90%]">

                {inArticle ? <SvgWrapper l={l} svg={<Check color="lightGreen" size={18} />} /> : <SvgWrapper l={l} svg={<Circle color="orange" size={18} />} />}

                <div className="hover:scale-105 active:scale-90 cursor-pointer" onClick={handleDelete} ><Trash color="red" size={18} /></div>
            </div>
        </div>
    </div>)
}

const SvgWrapper = ({ svg, l }) => {
    const setArticleList = useSetRecoilState(articleListAtom)
    const handleClick = () => {
        setArticleList(prev => {
            let newList;
            const inArticle = prev.some(anime => anime.name === l.name)
            if (inArticle) {
                newList = prev.filter(anime => anime.name !== l.name)
            }
            else newList = [...prev, l]
            return newList;
        })
    }
    return <div onClick={handleClick} className="cursor-pointer w-fit h-fit">{svg}</div>
}



const Post = () => {
    const setToastmsg = useSetRecoilState(toastMsgAtom)
    const [TagsList, setTagsList] = useState([])
    const [Tag, setTag] = useState("");
    const [loading, setLoading] = useState(false)
    const [imageLinks, setImageLinks] = useState([])
    const [link, setLink] = useState("")


    const animeNameRef = useRef();

    const [ratingState, setRatingState] = useState("")

    const [durationState, setDurationState] = useState("")

    const [episodesState, setEpisodesState] = useState("")

    const [formatState, setFormatState] = useState("")

    const [imageCreditsState, setImageCreditsState] = useState("")

    const [sourceState, setSourceState] = useState("")
    const [recTitleState, setRecTitleState] = useState("")

    const [studioState, setStudioState] = useState("")

    const [releaseDateState, setReleaseDateState] = useState("")
    const [descState, setDescState] = useState("")
    const [ageRatingState, setAgeRatingState] = useState("");

    const SavePost = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)

        const anime = {}
        formData.forEach((value, key) => {
            anime[key] = value;
        });

        anime['imageLinks'] = imageLinks
        anime['tags'] = TagsList

        setLoading(true)
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}add-anime`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(anime)
            })

            const data = await response.json()

            if (data.statusCode >= 300) {
                setToastmsg(data?.data || "cannot save this anime")
                setLoading(false)
                return;
            }
            setToastmsg("saved anime " + anime['name']);
            setLoading(false)
        } catch (error) {
            setToastmsg(error?.message || "cannot save this anime")
            setLoading(false)
        }

    }

    const AutoFill = async () => {
        if (animeNameRef.current.value?.trim() === "") {

            setToastmsg("For autoFill, first fill the name of the anime");
            return;
        }
        setLoading(true)
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${animeNameRef.current.value}`)

        const data = await response.json();
        if (!data) {
            setLoading(false)
            return;
        }
        const info = data?.data[0]?.attributes
        if (!info) {
            setLoading(false)
            return;
        }

        setRatingState(Math.round(info.averageRating))
        if(info.coverImage){
            imageLinks.push(info.coverImage.original || info.coverImage.large)
        }
      
        if (info.posterImage) {
            imageLinks.push(info.posterImage.original || info.posterImage.large)
        }

        setDescState(info.description)
        setEpisodesState(info.episodeCount)
        setDurationState(info.episodeLength)
        setFormatState(info.showType)
        setLoading(false)
        setImageCreditsState("anilist, MAL")
        setSourceState("Crunchyroll", "kitsuAnime api")
        setReleaseDateState(info.startDate)
        setRecTitleState("Top 10 Animes like " + animeNameRef.current.value)
        setAgeRatingState(info.ageRating)

        setLoading(false)

    }

    const eraseForm = () => {
        setRatingState("")
        setImageCreditsState("")
        setDescState("")
        setEpisodesState("")
        setDurationState("")
        setFormatState("")
        setSourceState("")
        setReleaseDateState("")
        setRecTitleState("")
        setAgeRatingState("")
        setImageLinks([])
        setTagsList([])
        setTag("")
        setStudioState("")
        setLink("")

    }

    return (<div className="max-w-screen min-w-[40vw]" >
        {loading && <AdminLoader />}
        <form onSubmit={SavePost} >
            <div className="flex flex-col w-fit gap-3 border p-10 rounded text-dark ">
                <div className="flex justify-between" >
                    <div className="relative inline-block group">
                        <button disabled={loading} type="submit" className={`border rounded px-1 hover:bg-green-900 ${!loading && "hover:scale-105 active:scale-90"} ease-linear duration-75  bg-dark`} ><Save color="lightGreen" /></button>

                        {!loading && <p className="hidden absolute w-20 rounded text-sm bg-secondary px-1 top-[-1rem] left-[110%] z-20 text-desc group-hover:block" >Save this anime</p>}
                    </div>

                    <div className="relative inline-block group">
                        <button
                            onClick={AutoFill}
                            disabled={loading}
                            type="button" className={`border hover:bg-amber-900 rounded px-1 hover:scale-105 ease-linear duration-75 active:scale-90 bg-secondary `} ><Workflow color="orange" /></button>

                        <p className="hidden absolute w-20 rounded text-sm bg-secondary px-1 top-[-1rem] left-[110%] text-desc group-hover:block" >Auto fill</p>
                    </div>

                    <div className="relative inline-block group">
                        <button
                            onClick={eraseForm}
                            disable={loading}
                            type="button" className={`border hover:bg-blue-900 rounded px-1 hover:scale-105 ease-linear duration-75 active:scale-90 bg-secondary `} ><Eraser color="lightBlue" /></button>

                        <p className="hidden absolute w-20 rounded text-sm bg-secondary px-1 top-[-1rem] left-[110%] text-desc z-20 group-hover:block" >clear the form</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <input type="text" ref={animeNameRef} placeholder="name" name="name" className={`px-2 max-w-52 py-1 mt-2 rounded`} />

                    <AnimeInput placeholder="rating" state={ratingState} setState={setRatingState} />

                    <AnimeInput placeholder="format" state={formatState} setState={setFormatState} />

                    <AnimeInput placeholder="episodes" state={episodesState} setState={setEpisodesState} />

                    <AnimeInput placeholder="duration" state={durationState} setState={setDurationState} />

                    <AnimeInput placeholder="imageCredits" state={imageCreditsState} setState={setImageCreditsState} />

                    <AnimeInput placeholder="source" state={sourceState} setState={setSourceState} />

                    <AnimeInput placeholder="studio" state={studioState} setState={setStudioState} />
                    <AnimeInput placeholder="ageRating" state={ageRatingState} setState={setAgeRatingState} />

                    <AnimeInput placeholder="releaseDate" state={releaseDateState} setState={setReleaseDateState} />

                    <AnimeInput placeholder="recTitle" state={recTitleState} setState={setRecTitleState} />

                </div>

                <textarea value={descState} onChange={(e) => setDescState(e.target.value)} placeholder="long Description" name="longDescription" className="px-2 max-w-52 py-1 rounded"></textarea>

                <div className="flex gap-8 flex-wrap text-desc">
                    {imageLinks.map((l, i) => <LinkTag link={l} setImageLinks={setImageLinks} linkNum={i + 1} key={i} />)}
                </div>

                <div className="flex gap-2 max-w-52">
                    <input value={link} onChange={(e) => setLink(e.target.value)} type="text" placeholder="image link " className="max-w-[80%] px-2 py-1 rounded" />

                    <button type="button" className="max-w-[20%] active:scale-75 hover:scale-110 duration-75 ease-linear" onClick={() => setImageLinks(prev => [...prev, link])} ><Plus color="green" /></button>
                </div>


                <label className="text-desc" htmlFor="tags">Add Tags</label>
                <div className="flex flex-col gap-4 max-w-52">
                    <div className="flex flex-wrap gap-2" >{TagsList.map((t, i) => <Tags key={i} setTagsList={setTagsList} tag={t} />)}</div>
                    <div className="flex gap-2 max-w-52" >
                        <input value={Tag} onChange={(e) => {
                            setTag(e.target.value)
                        }} className="bg-slate-300 max-w-[80%] text-dark rounded px-2 py-1" ></input>
                        <div className="active:scale-95 p-1 bg-primary w-fit rounded" onClick={() => {
                            setTagsList(prev => {
                                const tagList = Tag.split(" ");
                                return [...prev, ...tagList]
                            })
                            setTag("")
                        }} ><Plus size={20} color="black" /></div>
                    </div>
                </div>

            </div>
        </form>
    </div>)
}


const AnimeInput = ({ placeholder, state, setState }) => {
    return (<input value={state} onChange={(e) => setState(e.target.value)} type="text" placeholder={placeholder} name={placeholder} className={`px-2 max-w-52 py-1 mt-2 rounded`} />)
}