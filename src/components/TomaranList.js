import React from 'react';
import TomarCard from './TomarCard'; // پشتراست بە کو ئەڤە ل جهێ خو یە

const TomaranList = ({ isLoading, currentItems, ...handlers }) => {
    if (isLoading) {
        return <p style={{ textAlign: 'center', width: '100%' }}>داتایێن تە دهێنە ئینان...</p>;
    }

    if (currentItems.length === 0) {
        return <p style={{ textAlign: 'center', width: '100%' }}>هیچ تۆمارەک ب ڤان پێڤەران نەهاتە دیتن.</p>;
    }

    return (
        <div id="tomaran-list" className="cards-container">
            {currentItems.map(tomar => (
                <TomarCard 
                    key={tomar.id} 
                    tomar={tomar} 
                    onDelete={handlers.onDelete}
                    onPayFull={handlers.onPayFull}
                    onPartialPay={handlers.onPartialPay}
                    onShowImage={handlers.onShowImage}
                    onEdit={handlers.onEdit}
                />
            ))}
        </div>
    );
};

export default TomaranList;