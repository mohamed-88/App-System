import React from 'react';

function TomarCard({ tomar, onPayFull, onPartialPay, onDelete, onShowImage, onEdit }) {
    const buhaGishti = tomar.buha_gishti || 0;
    const pareHatiDan = tomar.pare_hati_dan || 0;
    const pare_mayi = buhaGishti - pareHatiDan;

    let rewşaClass = 'unpaid';
    let rewşaText = 'پارە نەهاتیە دان';
    if (pare_mayi <= 0 && buhaGishti > 0) { rewşaClass = 'paid'; rewşaText = 'پارە بتمامی هاتیە دان'; } 
    else if (pareHatiDan > 0) { rewşaClass = 'partial-paid'; rewşaText = 'ب پارچە هاتیە دان'; }

    function handleSendWhatsApp() {
        if (!tomar.telefon) {
            alert("ژمارا تەلەفۆنێ یا ڤی تۆماری نینە!");
            return;
        }
        
        // --- GUHARTIN LI VIR HATIYE KIRIN ---
        // Têbînî li dumahiyê hatiye zêdekirin
        const message = `
*ناڤێ کریاری:* ${tomar.nav || 'نەدیار'}
*پارچە:* ${tomar.kelupel || 'نینە'}
*بها:* ${buhaGishti.toLocaleString()} IQD
*کود:* ${tomar.product_code || 'نینە'}
*جهـ:* ${tomar.cih || 'نینە'}
*سایز:* ${tomar.sayiz || 'نینە'}
*رێکەفتا تۆمارکرنێ:* ${tomar.dîroka_zêdekirinê.toDate().toLocaleDateString('ku-IQ')}

${tomar.wene ? `*لینکێ وێنەی:*\n${tomar.wene}\n` : ''}
-----------------------------------
*تێبینی:* سوپاس بو باوەریا تە، داخازیاتە هاتە وەرگرتن. داخازیاتە دێ د ماوێ 15 تا 18 رۆژان دا گەهیتە دەستێ تە.
        `.trim();

        const encodedMessage = encodeURIComponent(message);
        let phoneNumber = tomar.telefon.replace(/\s+/g, '');
        if (phoneNumber.startsWith('07')) {
            phoneNumber = '964' + phoneNumber.substring(1);
        }
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    return (
        <div className="tomar-card">
            {tomar.wene ? (<img src={tomar.wene} alt={tomar.nav} className="card-image" onClick={() => onShowImage(tomar.wene)} />) 
            : (<div className="no-image"><span>وێنە نینە</span></div>)}
            <div className="card-content">
                <div className="card-header">
                    <h3 className="name">{tomar.nav}</h3>
                    <span className={`rewş-badge ${rewşaClass}`}>{rewşaText}</span>
                </div>
                <div className="card-details">
                    <p><strong>پارچە:</strong> {tomar.kelupel || 'نینە'}</p>
                    <p><strong>بها:</strong> {buhaGishti.toLocaleString()} IQD</p>
                    <p><strong>کود:</strong> {tomar.product_code || 'نینە'}</p>
                    <p><strong>جهـ:</strong> {tomar.cih || 'نینە'}</p>
                    <p><strong>تەلەفۆن:</strong> {tomar.telefon || 'نینە'}</p>
                    <p><strong>سایز:</strong> {tomar.sayiz || 'نینە'}</p>
                    <p><strong>رێکەفتا تۆمارکرنێ:</strong> {tomar.dîroka_zêdekirinê.toDate().toLocaleDateString('ku-IQ')}</p>
                </div>
                <div className="card-footer">
                    {pare_mayi > 0 && <button style={{ fontSize: '12px' }} className="btn action-btn paid-btn" onClick={() => onPayFull(tomar)}>پارا بتمامی بدە</button>}
                    <button className="btn action-btn edit-btn" onClick={() => onEdit(tomar)} style={{ fontWeight: 'bold' }}>دەستکاری</button>
                    
                    <button className="btn action-btn delete-btn" onClick={() => onDelete(tomar.id)} style={{ fontWeight: 'bold' }}>ژێبرن</button>

                    {tomar.telefon && 
                        <button 
                            className="btn action-btn" 
                            style={{ backgroundColor: '#1aa64dff', color: 'white', fontWeight: 'bold', fontSize: '12px' }} 
                            onClick={handleSendWhatsApp}>
                            فرێکرن ب WhatsApp
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}
export default TomarCard;