import React from 'react';

const Snowflake = ({ style }) => {
    return (
        <div
            style={{
                position: 'absolute',
                backgroundColor: '#fff',
                borderRadius: '50%',
                opacity: 0.9,
                ...style,
            }}
        />
    );
};

export default Snowflake;

