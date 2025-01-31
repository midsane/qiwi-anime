import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose()
        }, 3000);
        return () => clearTimeout(timeout)
    }, [])
    return (
        createPortal(<div
            className="fixed top-5 right-5 z-50  bg-blue-500 text-white p-4 rounded-md shadow-lg"
            style={{ transition: 'opacity 0.5s' }}
        >
            {message}
            <button
                onClick={onClose}
                className="ml-4 text-white hover:text-gray-200"
                aria-label="Close toast"
            >
                &times;
            </button>
        </div>, document.getElementById('root'))
    );
};


