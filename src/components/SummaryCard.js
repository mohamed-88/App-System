import React from 'react';

function SummaryCard({ tomaran }) {
    // Hesabkirina nirxan
    const hejmaraTomaran = tomaran.length;
    
    const koleksiyonaPareyan = tomaran.reduce((total, tomar) => {
        total.buhaGishti += tomar.buha_gishti || 0;
        total.pareHatiDan += tomar.pare_hati_dan || 0;
        return total;
    }, { buhaGishti: 0, pareHatiDan: 0 });

    const pareMayi = koleksiyonaPareyan.buhaGishti - koleksiyonaPareyan.pareHatiDan;

    const formatPare = (amount) => {
        return `${amount.toLocaleString()} IQD`;
    };

    return (
        <div className="controls-container">
            <div className="summary-card">
                <div className="summary-item count">
                    <span>هەژمارا تۆماران:</span>
                    <strong>{hejmaraTomaran}</strong>
                </div>
                <div className="summary-item">
                    <span>کۆژمێ پارەیێ مای:</span>
                    <strong style={{ color: 'var(--secondary)' }}>{formatPare(pareMayi)}</strong>
                </div>
                <div className="summary-item">
                    <span>کۆژمێ پارەیێ هاتیە دان:</span>
                    <strong style={{ color: 'var(--green)' }}>{formatPare(koleksiyonaPareyan.pareHatiDan)}</strong>
                </div>
                <div className="summary-item total">
                    <span>کۆژمێ گشتی:</span>
                    <strong>{formatPare(koleksiyonaPareyan.buhaGishti)}</strong>
                </div>
            </div>
        </div>
    );
}

export default SummaryCard;