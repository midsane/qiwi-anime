import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimeLogo } from "./animelogo"

export function AdminLoader() {
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer)
                    setTimeout(() => setLoading(false), 500)
                    return 100
                }
                return prev + 2
            })
        }, 50)
        return () => clearInterval(timer)
    }, [])

    const particles = Array.from({ length: 20 }, (_, i) => i)

    return (createPortal(<>
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 flex flex-col items-center justify-center bg-dark overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                 
                    <div className="absolute inset-0">
                        {particles.map((i) => (
                            <motion.div
                                key={i}
                                className="absolute h-0.5"
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

                    {/* Chakra Energy Circles */}
                    <div className="absolute">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full border-2 border-desc"
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

                    {/* Main Logo Container */}
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
                        {/* Energy Burst Behind Logo */}
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
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-dark to-secondary blur-2xl" />
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

                        {/* Orbiting Elements */}
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
                                    className="h-2 w-2 -ml-1 -mt-1 rounded-full bg-orange-500"
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

                    {/* Progress Bar */}
                    <div className="absolute bottom-20 w-64">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-desc">
                            <motion.div
                                className="absolute h-full bg-gradient-to-r from-dark to-secondary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                        <motion.div
                            className="mt-4 text-center text-sm font-bold text-desc"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            Loading... {progress}%
                        </motion.div>
                    </div>

                    {/* Floating Kanji Characters */}
                    {["忍", "者", "道", "術"].map((kanji, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-2xl font-bold text-name"
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
        </AnimatePresence>
    
    </>, document.body)
       
    )
}

