import { motion } from 'framer-motion';
import { ArticlesCarousel } from '../components/carouselarticle';
import { AnimeCard } from '../components/AnimeCard';
import { ChevronRight, Dot } from "lucide-react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLoader } from '../components/loader';
import { useSetRecoilState } from 'recoil';
import { toastMsgAtom } from '../atoms/atoms';
import { AnimeLogo } from '../components/animelogo';
import { Helmet } from 'react-helmet-async';

export function AnimePage() {
    const [articleInfo, setArticleInfo] = useState(undefined);
    const setToastMsg = useSetRecoilState(toastMsgAtom);
    const [loading, setLoading] = useState(true);
    const { articleTitle } = useParams();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const getArticleInfo = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}article/${articleTitle}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    setLoading(false);
                    setToastMsg("Something went wrong");
                    return;
                }
                const data = await response.json();
                if (data.message) {
                    setArticleInfo(data.message[0]);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setToastMsg("Something went wrong");
            }
        };

        getArticleInfo();
    }, [articleTitle]);

    return (
        <>
            <Helmet>
                <title>{articleInfo?.title ? `${articleInfo.title} - Qiwi Animes` : "Anime Page - Qiwi Animes"}</title>
                <meta name="description" content={articleInfo?.intro ? `${articleInfo.intro.slice(0, 150)}...` : "Explore amazing anime articles and recommendations on Qiwi Animes."} />
                <meta name="keywords" content={`${articleInfo?.title}, anime, anime recommendations, ${articleInfo?.List?.map(a => a.name).join(", ")}`} />
                <meta property="og:title" content={articleInfo?.title || "Qiwi Animes"} />
                <meta property="og:description" content={articleInfo?.intro || "Explore amazing anime articles and recommendations on Qiwi Animes."} />
                <meta property="og:image" content={articleInfo?.bannerImgLink || "https://qiwianimes.me/default-banner.jpg"} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={window.location.href} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": articleInfo?.title,
                        "description": articleInfo?.intro,
                        "image": articleInfo?.bannerImgLink,
                        "author": {
                            "@type": "Organization",
                            "name": "Qiwi Animes"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Qiwi Animes",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://qiwianimes.me/logo.png"
                            }
                        },
                        "datePublished": new Date().toISOString(),
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": window.location.href
                        }
                    })}
                </script>
            </Helmet>
            <main className="relative min-h-screen sm:p-8 p-2">
                {loading && <AdminLoader />}

                <motion.h1
                    className="text-5xl md:text-7xl font-bold text-center text-primary mb-4 float"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {articleInfo?.title}
                </motion.h1>
                <motion.div className='w-full h-32 sm:h-52 overflow-hidden rounded'>
                    <motion.div
                        className="h-8 items-center flex gap-4 text-primary"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <AnimeLogo />
                        <p className='text-sm sm:text-lg'>{articleInfo?.title.slice(19, Math.min(articleInfo?.title.length, 44)) + "..."}</p>
                    </motion.div>
                    <div className='w-full h-24 sm:h-44 overflow-hidden bg-dark'>
                        <motion.img
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: -50 }}
                            transition={{ duration: 2 }}
                            className='min-w-full object-cover h-[150%] rounded aspect-auto'
                            src={articleInfo?.bannerImgLink}
                            alt={`Banner for ${articleInfo?.title}`}
                            loading="lazy"
                        />
                    </div>
                </motion.div>

                <motion.p
                    className="text-lg sm:text-xl text-center text-desc my-14"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    {articleInfo?.intro}
                </motion.p>

                <motion.div
                    className="text-lg sm:text-xl flex flex-col bg-dark text-desc gap-3 p-4 sm:p-8 rounded mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <div className='flex gap-2'>
                        <div><ChevronRight /> </div>
                        <h3 className='text-lg sm:text-xl text-primary'>Anime List in this article:</h3>
                    </div>
                    {articleInfo?.List?.map((a, i) => (
                        <div key={i} className='flex gap-2'>
                            <div><Dot size={20} /></div>
                            <p className='text-sm sm:text-lg'>{a.name}</p>
                        </div>
                    ))}
                </motion.div>

                <div className="flex flex-col justify-center items-center gap-8">
                    {articleInfo?.List?.map((anime, index) => (
                        <AnimeCard key={index} anime={anime} index={index} />
                    ))}
                </div>
                <ArticlesCarousel />
            </main>
        </>
    );
}