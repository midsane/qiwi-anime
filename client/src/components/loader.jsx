import React from 'react';
import { motion } from 'framer-motion';
import ReactDOM from "react-dom"

export const AdminLoader = ({ size = 100, color = '#3498db' }) => {
    const circleCount = 6;
    const circles = Array.from({ length: circleCount });

    const containerVariants = {
        animate: {
            rotate: 360,
            transition: {
                repeat: Infinity,
                duration: 3,
                ease: 'linear',
            },
        },
    };

    const circleVariants = {
        initial: { scale: 1, opacity: 0.7 },
        animate: { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] },
    };

    const circleTransition = {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut',
    };

    return (
        ReactDOM.createPortal(<div className='fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
            <motion.div
                style={{
                    width: size,
                    height: size,
                    position: 'relative',
                }}
                variants={containerVariants}
                animate="animate"
                aria-label="Loading"
                className='relative top-1/2 left-1/2'
            >
                <div className='w-fit h-fit absolute rounded p-1 bg-dark text-desc'><p>Loading...</p></div>
                {circles.map((_, index) => (
                    <motion.div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: size / 5,
                            height: size / 5,
                            borderRadius: '50%',
                            backgroundColor: color,
                            transform: `rotate(${(360 / circleCount) * index}deg) translate(${size / 2.5}px) rotate(-${(360 / circleCount) * index}deg)`,
                        }}
                        variants={circleVariants}
                        initial="initial"
                        animate="animate"
                        transition={{
                            ...circleTransition,
                            delay: (index / circleCount) * 2,
                        }}
                    />
                ))}
            </motion.div>
        </div>, document.getElementById('root'))
    );
};



