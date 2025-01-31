import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(currentPage);
            if (currentPage + 1 <= totalPages) pageNumbers.push(currentPage + 1);
            if (currentPage + 2 <= totalPages) pageNumbers.push(currentPage + 2);
            if (currentPage + 2 < totalPages) pageNumbers.push('...');
            if (currentPage < totalPages) pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex text-xs sm:text-md justify-center items-center space-x-2 mt-12 bg-background text-desc">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-secondary hover:bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft />
            </motion.button>

            <div className="flex space-x-2">
                {pageNumbers.map((number, index) => (
                    <React.Fragment key={index}>
                        {number === '...' ? (
                            <span className="w-2 sm:w-10 aspect-square flex items-center justify-center text-desc">
                                ...
                            </span>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-5 sm:w-10 aspect-square rounded-full flex items-center justify-center transition-colors ${currentPage === number
                                        ? 'bg-primary text-white'
                                        : 'bg-secondary text-gray-700 hover:bg-gray-300'
                                    }`}
                                onClick={() => onPageChange(number)}
                            >
                                {number}
                            </motion.button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-secondary hover:bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight />
            </motion.button>
        </nav>
    );
};

export default Pagination;

