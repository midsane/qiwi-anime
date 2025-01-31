import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {ZoomIn, ZoomOut, ChevronRight, ChevronLeft} from "lucide-react"

export function ImageCarousel({ images, alt }) {
    const [currentIndex, setCurrentIndex] = useState(images.length-1)
    const [isZoomed, setIsZoomed] = useState(false)

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    const toggleZoom = () => {
        setIsZoomed(!isZoomed)
    }

    return (
        <div className="relative overflow-hidden w-full h-64 md:h-96">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <img
                        loading='lazy'
                        src={images[currentIndex]}
                        alt={`${alt} - Image ${currentIndex + 1}`}
                        className={`relative z-0 w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    />
                    <div className={`absolute rounded
                    ${isZoomed && "rounded-lg scale-125"}
                    bottom-2 left-2 ease-linear duration-75 cursor-pointer z-10 bg-black p-2`} 
                    onClick={toggleZoom}
                    >
                        {isZoomed ? <ZoomOut color='white' /> : <ZoomIn color='white' />}
                    </div>
                    
                </motion.div>
            </AnimatePresence>
            <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 hover:bg-opacity-100 hover:scale-105 ease-linear duration-75 text-white p-2 rounded-full active:bg-opacity-75"
                onClick={prevImage}
            >
                <span className='flex relative justify-center items-center hover:scale-110 active:scale-75  ease-linear duration-75' >
                    <ChevronLeft />
                </span>
            </button>
            <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-75 hover:bg-opacity-100 hover:scale-105 ease-linear duration-75 text-white p-2 rounded-full active:bg-opacity-75"
                onClick={nextImage}
            >
                <span className='flex relative justify-center items-center hover:scale-110 active:scale-75  ease-linear duration-75' >
                   <ChevronRight />
                </span>
            </button>
        </div>
    )
}

