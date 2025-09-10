import React from 'react';

const ReportTemplate = React.forwardRef(({ tomaran }, ref) => {
    if (!tomaran || tomaran.length === 0) {
        return <div ref={ref}>هیچ داتایەک نینە بۆ نیشاندان.</div>;
    }

    const totalBuha = tomaran.reduce((sum, tomar) => sum + (tomar.buha_gishti || 0), 0);
    const totalPareDan = tomaran.reduce((sum, tomar) => sum + (tomar.pare_hati_dan || 0), 0);
    const totalMaye = totalBuha - totalPareDan;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    return (
        <div ref={ref} style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial, sans-serif'}}>
            
            <style>
                {`
                    .report-table th, .report-table td {
                        color: black !important;
                        border: 1px solid #424242;
                        padding: 8px;
                        text-align: center;
                    }
                    .report-table th {
                        background-color: #2d3436;
                        color: white !important;
                    }
                    .report-table .center-align {
                        text-align: center;
                    }
                    .report-footer {
                        background-color: #fbfbfbff;
                        color: white !important;
                        font-weight: bold;
                    }
                `}
            </style>

            <h1 style={{ textAlign: 'center', color: 'black' }}>ڕاپۆرتا تۆماران</h1>

            <div style={{ textAlign: 'center', fontSize: '12px', color: 'black' }}>

                <span style={{ direction: 'rtl' }}>رێکەفت: </span>

                <span style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>{dateStr}</span>
            </div>
            
            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>ناڤێ کڕیاری</th>
                        <th style={{ textAlign: 'center' }}>تەلەفۆن</th>
                        <th style={{ textAlign: 'center' }}>کودێ برودەکتی</th>
                        <th style={{ textAlign: 'center' }}>پارچە</th>
                        <th style={{ textAlign: 'center' }}>جهـ</th>
                        <th style={{ textAlign: 'center' }} className="center-align">سایز</th>
                        <th style={{ textAlign: 'center' }}>بهایێ گشتی</th>
                        <th style={{ textAlign: 'center' }}>پارێ هاتیە دان</th>
                        <th style={{ textAlign: 'center' }}>پارێ نەهاتیە دان</th>
                    </tr>
                </thead>
                <tbody>
                    {tomaran.map((tomar, index) => (
                        <tr key={index}>
                            <td>{tomar.nav || ''}</td>
                            <td>{tomar.telefon || ''}</td>
                            <td>{tomar.product_code || ''}</td>
                            <td>{tomar.kelupel || ''}</td>
                            <td>{tomar.cih || ''}</td>
                            <td className="center-align">{tomar.sayiz || ''}</td>
                            <td>{(tomar.buha_gishti || 0).toLocaleString()}</td>
                            <td>{(tomar.pare_hati_dan || 0).toLocaleString()}</td>
                            <td>{((tomar.buha_gishti || 0) - (tomar.pare_hati_dan || 0)).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="report-footer">
                        <td colSpan="6" className="center-align">کوژمێ گشتی</td>
                        <td>{totalBuha.toLocaleString()}</td>
                        <td>{totalPareDan.toLocaleString()}</td>
                        <td>{totalMaye.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
});

export default ReportTemplate;