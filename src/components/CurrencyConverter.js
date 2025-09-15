import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';

// SVG îkonên ji bo guhertinê (Swap)
const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
 );
const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
 );

function CurrencyConverter() {
    const OER_APP_ID = 'ed4cc4b3bb7d4fcaac7177056cacadbb';
    const MARKET_RATE_MULTIPLIER = 1.125;

    const [rate, setRate] = useState(null);
    const [usdValue, setUsdValue] = useState('100');
    const [iqdValue, setIqdValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- GUHERTINA NÛ 1: State ji bo guhertina cihan ---
    const [isSwapped, setIsSwapped] = useState(false);

    useEffect(() => {
        // ... (Koda API wek xwe dimîne)
        if (!OER_APP_ID || OER_APP_ID === 'APP_ID_YA_XWE_LI_VIR_DANINE') {
            setError('Ji kerema xwe App ID-a xwe di kodê de danîne.');
            setIsLoading(false);
            setRate(1470);
            return;
        }
        const url = `https://openexchangerates.org/api/latest.json?app_id=${OER_APP_ID}`;
        fetch(url ).then(res => res.json()).then(data => {
            if (data && data.rates && data.rates.IQD) {
                const adjustedRate = data.rates.IQD * MARKET_RATE_MULTIPLIER;
                setRate(adjustedRate);
            } else { throw new Error('Nirxê IQD nehat dîtin.'); }
            setIsLoading(false);
        }).catch(err => {
            console.error("Xeta API:", err);
            setError('Neşiyam nirxê zindî werbigirim.');
            setRate(1470);
            setIsLoading(false);
        });
    }, [OER_APP_ID]);

    useEffect(() => {
        if (rate) {
            const usd = parseFloat(usdValue);
            if (!isNaN(usd)) {
                setIqdValue((usd * rate).toFixed(0));
            }
        }
    }, [rate]);

    const handleUsdChange = (e) => {
        const value = e.target.value;
        setUsdValue(value);
        if (rate) {
            if (value === '' || isNaN(parseFloat(value))) {
                setIqdValue('');
            } else {
                setIqdValue((parseFloat(value) * rate).toFixed(0));
            }
        }
    };

    const handleIqdChange = (e) => {
        const value = e.target.value;
        setIqdValue(value);
        if (rate) {
            if (value === '' || isNaN(parseFloat(value))) {
                setUsdValue('');
            } else {
                setUsdValue((parseFloat(value) / rate).toFixed(2));
            }
        }
    };

    // --- GUHERTINA NÛ 2: Fonksiyona ji bo guhertina cihan ---
    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };

    // --- GUHERTINA NÛ 3: Wergirtin û formatkirina dîroka îro ---
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    if (isLoading) {
        return <div className="currency-converter-container">بارکرنا حاسیبێ...</div>;
    }

    // --- GUHERTINA NÛ 4: Komponentên input-ê ji bo dubare bikaranînê ---
    const UsdInput = (
        <div className="input-wrapper">
            <label htmlFor="usd-input">USD ($)</label>
            <input id="usd-input" type="number" value={usdValue} onChange={handleUsdChange} placeholder="0.00" />
        </div>
    );
    const IqdInput = (
        <div className="input-wrapper">
            <label htmlFor="iqd-input">IQD (ع.د)</label>
            <input id="iqd-input" type="number" value={iqdValue} onChange={handleIqdChange} placeholder="0" />
        </div>
    );

    return (
        <div className="currency-converter-container calculator-style">
            <h4 className="converter-title">حاسیبا گوهارتنا دراڤی</h4>
            <div className="calculator-inputs">
                {/* Li gorî `isSwapped` cihan diguherîne */}
                {isSwapped ? IqdInput : UsdInput}

                <div className="exchange-icon-wrapper" onClick={handleSwap} title="Guhertina cihan">
                    {/* Li gorî `isSwapped` îkonê diguherîne */}
                    {isSwapped ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>

                {isSwapped ? UsdInput : IqdInput}
            </div>
            
            {error && <p className="rate-footer error-notice">Têbînî: {error} Nirxekî berdest tê bikaranîn.</p>}
            
            <div className="footer-info">
                <p className="rate-footer">
                    نرخێ نوکە (نێزیکەیی): 1$ ≈ {rate ? rate.toFixed(0) : '...'} IQD
                </p>
                {/* Dîroka îro li vir tê nîşandan */}
                <p className="date-footer">{formattedDate}</p>
            </div>
        </div>
    );
}

export default CurrencyConverter;




// import React, { useState, useEffect } from 'react';
// import './CurrencyConverter.css';

// // SVG îkona ji bo guhertinê
// const ExchangeIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <line x1="12" y1="5" x2="12" y2="19"></line>
//         <polyline points="19 12 12 19 5 12"></polyline>
//     </svg>
//  );

// function CurrencyConverter() {
//     const OER_APP_ID = 'ed4cc4b3bb7d4fcaac7177056cacadbb'; // Vê biguherîne

//     // =================================================================
//     // --- GUHERTIN LI VIR HATE KIRIN ---
//     // Rêje ji 1.10 hate guhertin bo 1.125 da ku nirx nêzîkî 147,000 bibe
//     const MARKET_RATE_MULTIPLIER = 1.125;
//     // =================================================================

//     const [rate, setRate] = useState(null);
//     const [usdValue, setUsdValue] = useState('100');
//     const [iqdValue, setIqdValue] = useState('');
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!OER_APP_ID || OER_APP_ID === 'APP_ID_YA_XWE_LI_VIR_DANINE') {
//             setError('Ji kerema xwe App ID-a xwe di kodê de danîne.');
//             setIsLoading(false);
//             setRate(1470); // Nirxekî destnîşankirî
//             return;
//         }
//         const url = `https://openexchangerates.org/api/latest.json?app_id=${OER_APP_ID}`;
//         fetch(url )
//             .then(res => res.json())
//             .then(data => {
//                 if (data && data.rates && data.rates.IQD) {
//                     const adjustedRate = data.rates.IQD * MARKET_RATE_MULTIPLIER;
//                     setRate(adjustedRate);
//                 } else {
//                     throw new Error('Nirxê IQD nehat dîtin.');
//                 }
//                 setIsLoading(false);
//             })
//             .catch(err => {
//                 console.error("Xeta API:", err);
//                 setError('Neşiyam nirxê zindî werbigirim.');
//                 setRate(1470); // Nirxekî nêzîkî yê bazara azad
//                 setIsLoading(false);
//             });
//     }, [OER_APP_ID]);

//     useEffect(() => {
//         if (rate) {
//             const usd = parseFloat(usdValue);
//             if (!isNaN(usd)) {
//                 setIqdValue((usd * rate).toFixed(0));
//             }
//         }
//     }, [rate]);

//     const handleUsdChange = (e) => {
//         const value = e.target.value;
//         setUsdValue(value);
//         if (rate) {
//             if (value === '' || isNaN(parseFloat(value))) {
//                 setIqdValue('');
//             } else {
//                 const calculatedIqd = (parseFloat(value) * rate).toFixed(0);
//                 setIqdValue(calculatedIqd);
//             }
//         }
//     };

//     const handleIqdChange = (e) => {
//         const value = e.target.value;
//         setIqdValue(value);
//         if (rate) {
//             if (value === '' || isNaN(parseFloat(value))) {
//                 setUsdValue('');
//             } else {
//                 const calculatedUsd = (parseFloat(value) / rate).toFixed(2);
//                 setUsdValue(calculatedUsd);
//             }
//         }
//     };

//     if (isLoading) {
//         return <div className="currency-converter-container">بارکرنا حاسیبێ...</div>;
//     }

//     return (
//         <div className="currency-converter-container calculator-style">
//             <h4 className="converter-title">حاسیبا گوهارتنا دراڤی</h4>
//             <div className="calculator-inputs">
//                 <div className="input-wrapper">
//                     <label htmlFor="usd-input">USD ($)</label>
//                     <input
//                         id="usd-input"
//                         type="number"
//                         value={usdValue}
//                         onChange={handleUsdChange}
//                         placeholder="0.00"
//                     />
//                 </div>
//                 <div className="exchange-icon-wrapper">
//                     <ExchangeIcon />
//                 </div>
//                 <div className="input-wrapper">
//                     <label htmlFor="iqd-input">IQD (ع.د)</label>
//                     <input
//                         id="iqd-input"
//                         type="number"
//                         value={iqdValue}
//                         onChange={handleIqdChange}
//                         placeholder="0"
//                     />
//                 </div>
//             </div>
//             {error && <p className="rate-footer error-notice">Têbînî: {error} Nirxekî berdest tê bikaranîn.</p>}
//             <p className="rate-footer">
//                 نرخێ نوکە (نێزیکەیی): 1$ ≈ {rate ? rate.toFixed(0) : '...'} IQD
//             </p>
//         </div>
//     );
// }

// export default CurrencyConverter;