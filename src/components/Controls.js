import React from 'react';

const Controls = ({
    searchTerm, onSearchChange, onClearSearch,
    activeFilter, onFilterChange,
    activeSort, onSortChange,
    onExportPDF, onAddNew
}) => {
    return (
        // Me navekî nû da klasî da ku stîlên kevin tevlihev nebin
        <div className="controls-container-final">
            
            {/* Rêza 1: Fîlteran (Wekî berê dimîne) */}
            <div className="filter-buttons-final">
                <button className={`filter-btn-final ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => onFilterChange('all')}>هەمی</button>
                <button className={`filter-btn-final ${activeFilter === 'not_paid' ? 'active' : ''}`} onClick={() => onFilterChange('not_paid')}>قەردار</button>
                <button className={`filter-btn-final ${activeFilter === 'paid' ? 'active' : ''}`} onClick={() => onFilterChange('paid')}>پارەداین</button>
            </div>

            {/* Rêza 2: Rêza serekî ya دوکمان */}
            <div className="action-buttons-row-final">
                {/* Ev hêman dê li llayê rastê بیت ژبەر RTL */}
                <button onClick={onAddNew} className="btn btn-primary" style={{ fontSize: '11px' }}>
                    + زێدەکرنا تۆمارێ
                </button>
                
                {/* Ev hêman dê li navê بیت */}
                <button className="export-btn-final" onClick={onExportPDF} style={{ fontSize: '11px' }}>
                   PDF
                </button>

                {/* Ev hêman dê li llayê çepê بیت */}
                <div className="sort-container-final" style={{ fontSize: '11px' }}>
                    <label htmlFor="sort-select">ڕیزکرن لدیڤ:</label>
                    <select id="sort-select" className="sort-dropdown-final" value={activeSort} onChange={(e) => onSortChange(e.target.value)} style={{ fontSize: '11px' }}>
                        <option value="newest">نووترین</option>
                        <option value="oldest">کەڤنترین</option>
                        <option value="most_expensive">گرانترین</option>
                        <option value="cheapest">ئەرزانترین</option>
                    </select>
                </div>
            </div>

            {/* Rêza 3: Lêgerîn (Wekî berê dimîne) */}
            <div className="search-container-final">
                <input 
                    type="search" 
                    placeholder="لێگەریانێ لدیڤ ناڤ، تەلەفۆن یان کود..." 
                    onChange={onSearchChange} 
                    value={searchTerm} 
                />
                <svg className="search-icon-final" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                {searchTerm && (<span className="clear-search-btn" onClick={onClearSearch}>&times;</span>)}
            </div>
            
        </div>
    );
};

export default Controls;