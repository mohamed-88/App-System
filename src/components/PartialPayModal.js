import React, { useState } from 'react';

function PartialPayModal({ isOpen, onClose, tomar, onSubmit }) {
    const pareMayi = (tomar.buha_gishti || 0) - (tomar.pare_hati_dan || 0);
    const [kojme, setKojme] = useState(pareMayi);
    
    if (!isOpen) return null;

    function handleSubmit(e) {
        e.preventDefault();
        const valueToSubmit = Number(kojme);
        if(valueToSubmit > 0 && valueToSubmit <= pareMayi) {
            onSubmit(valueToSubmit);
        } else {
            alert("دڤێت کۆژمە ژ سفرێ مەزنتر و ژ قەرزێ مای کێمتر بیت.");
        }
    }

    return (
        <div className="modal active">
            <div className="modal-content">
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2>زێدەکرنا پارەدانەکا نوو</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="kojme-paredane">کۆژمێ پارەیێ هاتیە دان:</label>
                        <input 
                            type="number" 
                            id="kojme-paredane" 
                            value={kojme}
                            onChange={(e) => setKojme(e.target.value)}
                            max={pareMayi}
                            min="1"
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">تۆمار بکە</button>
                </form>
            </div>
        </div>
    );
}

export default PartialPayModal;