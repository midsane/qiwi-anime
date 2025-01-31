import React from 'react';

const Snowflake = ({ style }) => {
    return (
        <div
            style={{
                position: 'absolute',
                backgroundColor: '#fff',
                borderRadius: '50%',
                opacity: 0.8,
                ...style,
            }}
        />
    );
};

export default Snowflake;

