import { motion } from 'framer-motion';
import { ImageCarousel } from './ImageCarousel';
import { ExternalLink, ChevronDown, ChevronUp, Smile, Meh, Frown, Clock, Disc, Tv, Snowflake, Cat } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AnimeCard({ anime, index }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <motion.article
                className="bg-dark rounded-lg shadow-lg overflow-hidden w-1/2 min-w-[30rem] max-[500px]:min-w-[25rem] max-[400px]:min-w-80"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
            >
                <ImageCarousel images={anime.imageLinks} alt={anime.name} />
                <div className="p-6">
                    <motion.h2
                        id={`anime-title-${index}`}
                        className="text-3xl font-bold text-name mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {anime.name}
                    </motion.h2>

                    <motion.div
                        className="text-primary mb-4 flex justify-around items-center bg-secondary p-1 sm:p-2 rounded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <InfoTags content="Format" val={anime.format} />
                        <InfoTags content="Rating" val={anime.rating} />
                        <InfoTags content="Duration" val={anime.duration} />
                        <InfoTags content="ageRating" val={anime.ageRating} />
                        <InfoTags content="Episodes" val={anime.episodes} />
                    </motion.div>

                    <motion.div
                        className="flex flex-wrap gap-2 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        {anime.tags && anime.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-secondary text-orange px-2 py-1 rounded text-sm"
                                aria-label={`Tag: ${tag}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    <motion.p
                        className="text-desc mb-4"
                        id={`anime-description-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {!isExpanded ? (
                            anime.longDescription.length > 200
                                ? `${anime.longDescription.slice(0, 200)}...`
                                : anime.longDescription
                        ) : (
                            anime.longDescription
                        )}
                    </motion.p>

                    <button
                        aria-expanded={isExpanded}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-primary px-2 py-1 flex justify-between cursor-pointer w-fit gap-3 rounded bg-secondary"
                    >
                        {!isExpanded ? (
                            <>
                                <p>View More</p>
                                <ChevronDown color="brown" />
                            </>
                        ) : (
                            <>
                                <p>View Less</p>
                                <ChevronUp color="brown" />
                            </>
                        )}
                    </button>

                    <div className="text-sm mt-4 text-date">
                        <p>Release Date: {anime.releaseDate}</p>
                        {anime.studio && <p>Studio: {anime.studio}</p>}
                    </div>

                    <p className="text-xs text-credits mt-4">Sources:</p>
                    <ul className="text-xs text-credits mt-1">
                        {anime.imageCredits && <li>{anime.imageCredits}</li>}
                        {anime.source && <li>{anime.source}</li>}
                    </ul>

                    {anime.recTitle && anime.recTitle.length > 0 && (
                        <a
                            href={`/anime/${anime.recTitle[0].title}`}
                            aria-labelledby={`anime-title-${index} recommended-title`}
                            className="mt-2 cursor-pointer flex p-4 rounded bg-secondary flex-col gap-2"
                        >
                            <motion.div
                                onClick={() => navigate(`/anime/${anime.recTitle[0].title}`)}
                            >
                                <div className="flex justify-between">
                                    <h4 id="recommended-title" className="text-name">
                                        Recommended Read
                                    </h4>
                                    <ExternalLink color="white" />
                                </div>
                                <div className="flex flex-col 2xl:flex-row overflow-hidden gap-6">
                                    <img
                                        loading='lazy'
                                        alt={anime.recTitle[0].title}
                                        src={anime.recTitle[0].bannerImgLink}
                                        className="rounded h-20 object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-orange">{anime.recTitle[0].title}</p>
                                        <p className="text-slate-300">
                                            {anime.recTitle[0].intro.slice(
                                                0,
                                                Math.min(anime.recTitle[0].intro.length, 20)
                                            ) + "..."}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </a>
                    )}
                </div>
            </motion.article>
        </>
    );
}

const InfoTags = ({ content, val }) => {
    if (!val) return null;

    let svg;
    let text = val;
    let svgSize = 18;

    switch (content) {
        case "Format":
            svg = val.toLowerCase() === "tv" ? <Tv size={svgSize} /> : <Disc size={svgSize} />;
            break;
        case "Rating":
            svg = val > 80 ? <Smile size={svgSize} /> : val > 70 ? <Meh size={svgSize} /> : <Frown size={svgSize} />;
            text += " %";
            break;
        case "Episodes":
            svg = <Cat size={svgSize} />;
            if (text.length >= 3) text = "99+";
            text += " Ep";
            break;
        case "Duration":
            svg = <Clock size={svgSize} />;
            text += " m";
            break;
        case "ageRating":
            svg = <Snowflake size={svgSize} />;
            break;
    }

    text = text.slice(0, 6);
    return (
        <div
            className="px-4 bg-dark py-2 max-[400px]:px-2 flex sm:gap-2 gap-1 justify-center items-center flex-col rounded-lg text-sm"
            role="group"
            aria-label={`${content}: ${text}`}
        >
            <div className="flex gap-1 sm:gap-2 flex-col justify-center items-center">
                <span>{svg}</span>
                {text && <p>{text}</p>}
            </div>
        </div>
    );
};