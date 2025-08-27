import React, { useState, useEffect } from 'react';


const IMGBB_API_KEY = "5f39714e59c86e2e4adab4b04ec9d1a3";

function FormModal({ isOpen, onClose, onSave, editingTomar }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('تۆمار بکە');
    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (editingTomar) {
                setCurrentData(editingTomar);
                setSubmitStatus('گوهۆڕینان تۆمارا بکە');
            } else {
                setCurrentData({});
                setSubmitStatus('تۆمار بکە');
            }
        }
    }, [editingTomar, isOpen]);

    if (!isOpen) return null;

    function handleChange(e) {
        const { name, value } = e.target;
        setCurrentData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        const formElement = event.target;
        const formData = new FormData(formElement);
        const weneFile = formData.get('wene');
        let weneUrl = currentData.wene || null;

        try {
            if (weneFile && weneFile.size > 0) {
                setSubmitStatus('وێنە دهێتە بلندکرن...');
                const imgbbFormData = new FormData();
                imgbbFormData.append('image', weneFile);
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: imgbbFormData });
                const result = await response.json();
                if (result.success) {
                    weneUrl = result.data.url;
                } else {
                    throw new Error('Çewtî di bilindkirina wêneyî da.');
                }
            }
            
            setSubmitStatus('داتا دهێنە تۆمارکرن...');
            const dataToSave = {
                nav: currentData.nav,
                telefon: currentData.telefon,
                kelupel: currentData.kelupel,
                cih: currentData.cih,
                sayiz: currentData.sayiz,
                // --- LI VIR HATIYE ZÊDEKIRIN ---
                product_code: currentData.product_code, 
                buha_gishti: Number(currentData.buha_gishti),
                wene: weneUrl,
            };

            await onSave(dataToSave, currentData.id);
            formElement.reset();
            onClose();
        } catch (error) {
            console.error(error);
            alert('خەلەتیە روودا!');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="modal active">
            <div className="modal-content">
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2>{editingTomar ? 'دەستکاریکرنا تۆمارێ' : 'زێدەکرنا تۆمارەکا نوو'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group"><label>ناڤێ کڕیاری:</label><input type="text" name="nav" value={currentData.nav || ''} onChange={handleChange} required /></div>
                    <div className="input-group"><label>رەقەم تەلەفۆن:</label><input type="tel" name="telefon" value={currentData.telefon || ''} onChange={handleChange} /></div>
                    {/* --- EV XANEYE HATIYE ZÊDEKIRIN --- */}
                    <div className="input-group"><label>پارچە:</label><input type="text" name="kelupel" value={currentData.kelupel || ''} onChange={handleChange} required /></div>
                    <div className="input-group"><label>بھا:</label><input type="number" name="buha_gishti" value={currentData.buha_gishti || ''} onChange={handleChange} required /></div>
                    <div className="input-group"><label>کودێ برودەکتێ:</label><input type="text" name="product_code" value={currentData.product_code || ''} onChange={handleChange} /></div>
                    <div className="input-group"><label>سایز:</label><input type="text" name="sayiz" value={currentData.sayiz || ''} onChange={handleChange} /></div>
                    <div className="input-group"><label>جهـ:</label><input type="text" name="cih" value={currentData.cih || ''} onChange={handleChange} /></div>
                    <div className="input-group"><label>وێنێ کەلوپەلی (ئەگەر دێ گوهۆڕی):</label><input type="file" name="wene" accept="image/*" /></div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{submitStatus}</button>
                </form>
            </div>
        </div>
    );
}
export default FormModal;