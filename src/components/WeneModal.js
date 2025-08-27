import React from 'react';

function WeneModal({ weneUrl, onClose }) {
    if (!weneUrl) {
        return null;
    }

    return (
        <div className="modal active" onClick={onClose}>
            <span className="close-modal" id="close-wene-modal" onClick={onClose}>&times;</span>
            <img 
                className="wene-modal-img-content" 
                src={weneUrl} 
                alt="Wêneya Mezin"
                onClick={(e) => e.stopPropagation()} // دا مۆدال نەهێتە گرتن دەمێ کلیک لسەر وێنەی دکەی
            />
        </div>
    );
}

export default WeneModal;