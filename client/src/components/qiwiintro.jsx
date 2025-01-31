import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimeLogo } from "./animelogo"



export function AnimeLoader({
    texts=["loading..."],
    duration = 1000,
    status = "intro"
}) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
        }, 300)

        const timer = setTimeout(() => {
            setLoading(false)
        }, duration)

        return () => {
            clearInterval(interval)
            clearTimeout(timer)
        }
    }, [texts, duration])

    const particles = Array.from({ length: 20 }, (_, i) => i)

    return (
        createPortal(<AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 bg-dark h-screen w-screen z-[200] flex flex-col items-center justify-center overflow-hidden"

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    <div className="absolute inset-0">
                        {particles.map((i) => (
                            <motion.div
                                key={i}
                                className="absolute h-0.5 bg-secondary"
                                initial={{
                                    left: "-10%",
                                    top: `${(i / particles.length) * 100}%`,
                                    width: "10%",
                                }}
                                animate={{
                                    left: "100%",
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.15,
                                    ease: "linear",
                                }}
                            />
                        ))}
                    </div>


                    <div className="absolute">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full border-2 border-secondary"
                                style={{
                                    width: 300 + i * 40,
                                    height: 300 + i * 40,
                                    left: -(150 + i * 20),
                                    top: -(150 + i * 20),
                                }}
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                            />
                        ))}
                    </div>


                    <motion.div
                        className="relative"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >

                        <motion.div
                            className="absolute inset-0 -z-10"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r bg-secondary to-primary blur-2xl" />
                        </motion.div>


                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                            style={{
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <AnimeLogo size="large" />
                        </motion.div>


                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                    delay: i * 0.3,
                                }}
                                style={{
                                    transformOrigin: "0 0",
                                }}
                            >
                                <motion.div
                                    className="h-2 w-2 -ml-1 -mt-1 rounded-full bg-desc"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: i * 0.3,
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>


                    <motion.div
                        className="absolute bottom-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key={currentTextIndex}
                        transition={{ duration: 0.5 }}
                    >{status === "intro" ?
                        <>

                            <h2 className="text-2xl font-bold text-desc mb-2">{texts[currentTextIndex]}</h2>
                            <p className="text-sm text-credits">Discover the world of anime</p>
                        </>
                        :
                        <p>loading...</p>
                        }
                    </motion.div>

                    {["忍", "者", "道", "術"].map((kanji, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-2xl font-bold text-desc"
                            initial={{
                                top: "50%",
                                left: "50%",
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.5, 0.5],
                                x: [0, (i % 2 ? 100 : -100) * Math.random()],
                                y: [0, (i % 2 ? 100 : -100) * Math.random()],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                                ease: "easeInOut",
                            }}
                        >
                            {kanji}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>, document.getElementById('root'))
    )
}

