import React from 'react';

function Pagination({ totalItems, itemsPerPage, setCurrentPage, currentPage }) {
    let pages = [];

    // Hejmartina hejmara hemû laperan
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pages.push(i);
    }

    if (pages.length <= 1) {
        return null; // Eger tenê lapelek hebe, tiştekî nîşan nede
    }

    return (
        <div className="pagination-container">
            {pages.map((page, index) => {
                return (
                    <button 
                        key={index} 
                        onClick={() => setCurrentPage(page)}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                );
            })}
        </div>
    );
}

export default Pagination;