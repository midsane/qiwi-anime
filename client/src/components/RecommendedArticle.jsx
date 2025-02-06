import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { CurrentPageArticlesAtom } from '../atoms/atoms';
import { useNavigate } from 'react-router-dom';
import { ArticlesCarousel } from './carouselarticle';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

export function RecommendedArticles() {
    const navigate = useNavigate();
    const articles = useRecoilValue(CurrentPageArticlesAtom);
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{articles?.[0]?.title || "Qiwi Animes - Your Source for Anime Reviews and News"}</title>
                <meta name="description" content={articles?.[0]?.intro || "Latest anime reviews, news, and updates."} />
                <meta name="keywords" content={articles?.map(a => a.title).join(", ")} />
                <meta property="og:image" content={articles?.[0]?.bannerImgLink || "/default-banner.jpg"} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={window.location.href} />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7224854598785257" crossOrigin="anonymous"></script>
            </Helmet>

            <ArticlesCarousel title="Latest Articles" />

            <section className="mt-20" aria-labelledby="browse-articles-title">
                <motion.h2
                    id="browse-articles-title"
                    className="text-3xl font-bold text-primary mb-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Browse All Articles
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles?.map((article, index) => (
                        <motion.article
                            key={index}
                            aria-labelledby={`article-title-${index}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/anime/${article?.title.replace(/\s+/g, "-")}`)}
                            className="bg-dark rounded-lg shadow-lg overflow-hidden cursor-pointer"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                loading="lazy"
                                onLoad={() => setImageLoading(false)}
                                src={article?.bannerImgLink || "/default-banner.jpg"}
                                alt={`Banner for ${article?.title || "Unknown article"}`}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 id={`article-title-${index}`} className="text-xl font-bold text-primary mb-2">
                                    {article?.title || "Untitled Article"}
                                </h3>
                                <p className="text-desc mb-4">
                                    {article?.intro?.length > 40 ? article?.intro.slice(0, 40) + "..." : article?.intro || "No description available"}
                                </p>
                                <button
                                    aria-label={`Read full article: ${article.title}`}

                                    className="inline-block bg-secondary bg-opacity-55 active:scale-105 ease-linear 
                                    text-name px-4 py-2 rounded hover:bg-opacity-100 transition-colors duration-300"
                                >
                                    Read More
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </>
    );
}
