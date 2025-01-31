import { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import { RecommendedArticles } from "../components/RecommendedArticle";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CurrentPageArticlesAtom, latestArticleAtom, numberOfArticlesAtom } from "../atoms/atoms";
import { Helmet } from "react-helmet-async";
import { AnimeLoader } from "../components/qiwiintro";

const PAGE_LIMIT = 6;
export default function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const numberOfArticle = useRecoilValue(numberOfArticlesAtom);
    const setCurrentPageArticle = useSetRecoilState(CurrentPageArticlesAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        setLoading(true);
        const getCurrentPageArticle = async () => {
            try {
                let limit = Math.min(PAGE_LIMIT, numberOfArticle);
                let offset = (currentPage - 1) * limit;

                if (numberOfArticle === 0) return;

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}get-all-article?limit=${limit}&offset=${offset}`);

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setCurrentPageArticle(data.message);
                setLoading(false);
            } catch (error) {
                return;
            }
        };
        getCurrentPageArticle();
    }, [currentPage, numberOfArticle]);

    return (
        <>
          <AnimeLoader texts={["Top anime blogs", "latest animes", "trends you can't miss"]}  duration={1000} />
            <Helmet>
                <title>Qiwi Animes - Latest Anime Recommendations</title>
                <meta name="description" content="Discover the latest trendy animes and get recommendations for your favorite ones on Qiwi Animes." />
                <link rel="canonical" href="https://qiwianimes.me" />
                <meta property="og:title" content="Qiwi Animes - Latest Anime Recommendations" />
                <meta property="og:description" content="Discover the latest trendy animes and get recommendations for your favorite ones on Qiwi Animes." />
                <meta property="og:image" content="https://qiwianimes.me/default-banner.jpg" />
                <meta property="og:type" content="website" />
            </Helmet>
            <main className="flex flex-col">
                {loading && <AnimeLoader status="loading" />}
                <RecommendedArticles />
                <Pagination currentPage={currentPage} totalPages={Math.ceil(numberOfArticle / PAGE_LIMIT)} onPageChange={setCurrentPage} />
            </main>
        </>
    );
}