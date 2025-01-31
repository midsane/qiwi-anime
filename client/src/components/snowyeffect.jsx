import React, { useState, useEffect } from 'react';
import Snowflake from './snowflake';

export const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const createSnowflake = () => {
            const size = Math.random() * 5 + 2;
            return {
                id: Math.random(),
                x: Math.random() * window.innerWidth,
                y: -size,
                size: size,
                speed: Math.random() * 4 + 0.5,
                opacity: Math.random(),
            };
        };

        const updateSnowflakes = () => {
            setSnowflakes((prevSnowflakes) =>
                prevSnowflakes
                    .map((flake) => ({
                        ...flake,
                        y: flake.y + flake.speed,
                    }))
                    .filter((flake) => flake.y < window.innerHeight)
                    .concat(Array.from({ length: 5 - prevSnowflakes.length }, createSnowflake))
            );
        };

        const intervalId = setInterval(updateSnowflakes, 50);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {snowflakes.map((flake) => (
                <Snowflake
                    key={flake.id}
                    style={{
                        left: `${flake.x}px`,
                        top: `${flake.y}px`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        opacity: flake.opacity,
                    }}
                />
            ))}
        </div>
    );
};



