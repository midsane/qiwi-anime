import { useEffect } from 'react'
import Slider from 'react-slick'
import { motion } from 'framer-motion'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useRecoilValue } from 'recoil'
import { latestArticleAtom } from '../atoms/atoms'
import { useNavigate } from 'react-router-dom'

export function ArticlesCarousel({ title = "Recommended Articles" }) {
    const articles = useRecoilValue(latestArticleAtom)
    const navigate = useNavigate()

    useEffect(() => {
        window.dispatchEvent(new Event('resize'))
    }, [])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    return (
        <section
            aria-labelledby="articles-carousel-title"
            className="mt-16 px-4"
        >
            <motion.h2
                id="articles-carousel-title"
                className="text-3xl font-bold text-primary mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {title}
            </motion.h2>
            <Slider {...settings}>
                {articles?.map((article, index) => (
                    <div key={index} className="px-2">
                        <motion.article
                            aria-labelledby={`article-title-${index}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/anime/${article.title}`)}
                            className="bg-secondary rounded-lg shadow-lg overflow-hidden h-96 cursor-pointer"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                loading='lazy'
                                src={article.bannerImgLink}
                                alt={`Banner for ${article.title}`}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3
                                    id={`article-title-${index}`}
                                    className="text-xl font-bold text-primary mb-2"
                                >
                                    {article.title}
                                </h3>
                                <p className="text-desc mb-4">
                                    {article.intro?.length > 60
                                        ? article.intro?.slice(0, 60) + "..."
                                        : article.intro}
                                </p>
                                <a
                                    aria-label={`Read full article: ${article.title}`}
                                    href={`/anime/${article.title}`}
                                    className="inline-block bg-dark bg-opacity-55 active:scale-105 ease-linear 
                                    text-name px-4 py-2 rounded hover:bg-opacity-100 transition-colors duration-300"
                                >
                                    Read More
                                </a>
                            </div>
                        </motion.article>
                    </div>
                ))}
            </Slider>
        </section>
    )
}
