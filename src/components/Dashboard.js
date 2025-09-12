import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import CurrencyConverter from './CurrencyConverter';
import './CurrencyConverter.css';
import { IconTotal, IconDebt, IconRevenue, IconPaid, IconAlert } from './Icons';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const PercentageChange = ({ value, isDebt = false }) => {
    if (value === null || isNaN(value)) return null;
    const isPositive = value > 0;
    const isNegative = value < 0;
    let color;
    if (isDebt) { color = isPositive ? '#e74c3c' : (isNegative ? '#2ecc71' : '#95a5a6'); } 
    else { color = isPositive ? '#2ecc71' : (isNegative ? '#e74c3c' : '#95a5a6'); }
    const symbol = isPositive ? '▲' : '▼';
    return (<span className="percentage-change" style={{ color }}>{symbol} {Math.abs(value).toFixed(0)}% ژ هەیڤا بۆری</span>);
};

function Dashboard({ tomaran }) {
    const dashboardData = useMemo(() => {
        const safeTomaran = Array.isArray(tomaran) ? tomaran : [];
        const now = new Date();

        const monthNames = ["کانونا دووێ", "کانونا دووێ", "ئادار", "نیسان", "گولان", "حوزەیران", "تەموز", "تەباخ", "ئەیلول", "تشرینا ئێکێ", "تشرینا دووێ", "کانونا ئیکێ"];
        const lineChartLabels = [];
        const lineChartRevenueData = Array(6).fill(0);
        const lineChartDebtData = Array(6).fill(0);

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            lineChartLabels.push(monthNames[d.getMonth()]);
        }

        let totalDebt = 0, totalRevenue = 0, paidCount = 0, notPaidCount = 0;
        let oldDebtsCount = 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let currentMonthRevenue = 0, prevMonthRevenue = 0;
        let currentMonthDebt = 0, prevMonthDebt = 0;

        safeTomaran.forEach(tomar => {
            const buha = tomar.buha_gishti || 0;
            const pareDan = tomar.pare_hati_dan || 0;
            const pareMayi = buha - pareDan;
            
            totalRevenue += pareDan;
            if (pareMayi > 0) { totalDebt += pareMayi; notPaidCount++; } else { paidCount++; }

            if (tomar.dîroka_zêdekirinê && typeof tomar.dîroka_zêdekirinê.toDate === 'function') {
                const tomarDate = tomar.dîroka_zêdekirinê.toDate();
                if (pareMayi > 0 && tomarDate < thirtyDaysAgo) oldDebtsCount++;

                const tomarMonth = tomarDate.getMonth();
                const tomarYear = tomarDate.getFullYear();

                if (tomarMonth === now.getMonth() && tomarYear === now.getFullYear()) {
                    currentMonthRevenue += pareDan;
                    if (pareMayi > 0) currentMonthDebt += pareMayi;
                } else if (tomarMonth === (now.getMonth() === 0 ? 11 : now.getMonth() - 1) && tomarYear === (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear())) {
                    prevMonthRevenue += pareDan;
                    if (pareMayi > 0) prevMonthDebt += pareMayi;
                }

                const monthDiff = (now.getFullYear() - tomarYear) * 12 + (now.getMonth() - tomarMonth);
                if (monthDiff >= 0 && monthDiff < 6) {
                    const index = 5 - monthDiff;
                    lineChartRevenueData[index] += pareDan;
                    if (pareMayi > 0) lineChartDebtData[index] += pareMayi;
                }
            }
        });

        let revenueChange = prevMonthRevenue > 0 ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : (currentMonthRevenue > 0 ? 100 : null);
        let debtChange = prevMonthDebt > 0 ? ((currentMonthDebt - prevMonthDebt) / prevMonthDebt) * 100 : (currentMonthDebt > 0 ? 100 : null);

        return { 
            totalTomaran: safeTomaran.length, totalDebt, totalRevenue, paidCount, notPaidCount, oldDebtsCount,
            revenueChange, debtChange,
            lineChartData: {
                labels: lineChartLabels,
                datasets: [
                    { label: 'داهات (Revenue)', data: lineChartRevenueData, borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.2)', fill: true, tension: 0.4 },
                    { label: 'قەرز (Debt)', data: lineChartDebtData, borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.2)', fill: true, tension: 0.4 }
                ]
            }
        };
    }, [tomaran]);

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#f0f0f0' } },
            title: { display: true, text: 'پێشکەفتنا داهات ۆ قەرزێت (6 هەیڤێت داوی)', color: '#f0f0f0', font: { size: 16 } }
        },
        scales: {
            x: { ticks: { color: '#f0f0f0' }, grid: { color: 'rgba(240, 240, 240, 0.1)' } },
            y: { ticks: { color: '#f0f0f0' }, grid: { color: 'rgba(240, 240, 240, 0.1)' } }
        }
    };

    const doughnutChartData = {
        labels: ['قەردار', 'پارەداین'],
        datasets: [{ data: [dashboardData.notPaidCount, dashboardData.paidCount], backgroundColor: ['#e94560', '#00712f'], borderColor: '#16213e', borderWidth: 4, hoverOffset: 10 }],
    };
    const doughnutChartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#f0f0f0', padding: 20, font: { size: 14 } } } },
        cutout: '75%'
    };

    return (
        <div className="dashboard-section">
            <h2 className="dashboard-title">کورتەیا ئاماران</h2>
            
            {dashboardData.oldDebtsCount > 0 && (
                <div className="stat-card hero-card alert">
                    <div className="text-container">
                        <div className="label">ئاگەهداری: قەرزێن کەڤن</div>
                        <div className="value">{dashboardData.oldDebtsCount} تۆمار ژ 30 رۆژان پترە</div>
                    </div>
                    <div className="icon-container"><IconAlert /></div>
                </div>
            )}

            <div className="dashboard-grid">
                {/* Beşa 1: Kartên Sereke */}
                <div className="hero-stats">
                    <div className="stat-card hero-card debt">
                        <div className="text-container">
                            <div className="label">کۆژمێ گشتی یێ قەرزان</div>
                            <div className="value">{dashboardData.totalDebt.toLocaleString()} IQD</div>
                            <PercentageChange value={dashboardData.debtChange} isDebt={true} />
                        </div>
                        <div className="icon-container"><IconDebt /></div>
                    </div>
                    <div className="stat-card hero-card revenue">
                        <div className="text-container">
                            <div className="label">کۆژمێ پارەیێ وەرگرتی</div>
                            <div className="value">{dashboardData.totalRevenue.toLocaleString()} IQD</div>
                            <PercentageChange value={dashboardData.revenueChange} />
                        </div>
                        <div className="icon-container"><IconRevenue /></div>
                    </div>
                </div>

                {/* Beşa 2: Amûrên Piçûk */}
                <CurrencyConverter />

                <div className="side-stats">
                    <div className="chart-container">
                        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                    </div>
                    <div className="secondary-cards-container">
                        <div className="stat-card secondary-card total">
                            <div className="text-container">
                                <div className="label">هەمی تۆمار</div>
                                <div className="value">{dashboardData.totalTomaran}</div>
                            </div>
                            <div className="icon-container"><IconTotal /></div>
                        </div>
                        <div className="stat-card secondary-card paid-count">
                            <div className="text-container">
                                <div className="label">تۆمارێن پارەداین</div>
                                <div className="value">{dashboardData.paidCount}</div>
                            </div>
                            <div className="icon-container"><IconPaid /></div>
                        </div>
                    </div>
                </div>

                {/* Beşa 3: Grafa Hêlî (Hat veguhestin bo dawiyê) */}
                <div className="line-chart-container">
                    <Line options={lineChartOptions} data={dashboardData.lineChartData} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;




// import React, { useMemo } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';

// // --- RASTKIRIN LI VÊRÊ ---
// // 1. Importkirina درست یا CurrencyConverter
// import CurrencyConverter from './CurrencyConverter'; 
// import './CurrencyConverter.css';

// ChartJS.register(ArcElement, Tooltip, Legend);

// // Îkonên SVG (wekî xwe dimînin)
// const IconTotal = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
// const IconDebt = ( ) => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
// const IconRevenue = ( ) => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
// const IconPaid = ( ) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

// function Dashboard({ tomaran } ) {
//     const dashboardData = useMemo(() => {
//         let totalDebt = 0, totalRevenue = 0, paidCount = 0, notPaidCount = 0;
//         tomaran.forEach(tomar => {
//             const buha = tomar.buha_gishti || 0;
//             const pareDan = tomar.pare_hati_dan || 0;
//             const pareMayi = buha - pareDan;
//             totalRevenue += pareDan;
//             if (pareMayi > 0) { totalDebt += pareMayi; notPaidCount++; } else { paidCount++; }
//         });
//         return { totalTomaran: tomaran.length, totalDebt, totalRevenue, paidCount, notPaidCount };
//     }, [tomaran]);

//     const chartData = {
//         labels: ['قەردار', 'پارەداین'],
//         datasets: [{ data: [dashboardData.notPaidCount, dashboardData.paidCount], backgroundColor: ['#e94560', '#00712f'], borderColor: '#16213e', borderWidth: 4, hoverOffset: 10 }],
//     };
//     const chartOptions = {
//         responsive: true, maintainAspectRatio: false,
//         plugins: { legend: { position: 'bottom', labels: { color: '#f0f0f0', padding: 20, font: { size: 14, family: "'Poppins', sans-serif" } } } },
//         cutout: '75%'
//     };

//     return (
//         <div className="dashboard-section">
//             <h2 className="dashboard-title">کورتەیا ئاماران</h2>
            
//             <div className="dashboard-grid">
//                 {/* STÛNA SEREKÎ (HERO CARDS) */}
//                 <div className="hero-stats">
//                     <div className="stat-card hero-card debt">
//                         <div className="text-container">
//                             <div className="label">کۆژمێ گشتی یێ قەرزان</div>
//                             <div className="value">{dashboardData.totalDebt.toLocaleString()} IQD</div>
//                         </div>
//                         <div className="icon-container"><IconDebt /></div>
//                     </div>
//                     <div className="stat-card hero-card revenue">
//                         <div className="text-container">
//                             <div className="label">کۆژمێ پارەیێ وەرگرتی</div>
//                             <div className="value">{dashboardData.totalRevenue.toLocaleString()} IQD</div>
//                         </div>
//                         <div className="icon-container"><IconRevenue /></div>
//                     </div>
//                 </div>

//                 {/* --- RASTKIRIN LI VÊRÊ --- */}
//                 {/* 2. Danîna CurrencyConverter li cihekî guncaw */}
//                 <CurrencyConverter />

//                 {/* GRAF Û KARTÊN PIÇÛK */}
//                 <div className="side-stats">
//                     <div className="chart-container">
//                         <Doughnut data={chartData} options={chartOptions} />
//                     </div>
//                     <div className="secondary-cards-container">
//                         <div className="stat-card secondary-card total">
//                             <div className="text-container">
//                                 <div className="label">هەمی تۆمار</div>
//                                 <div className="value">{dashboardData.totalTomaran}</div>
//                             </div>
//                             <div className="icon-container"><IconTotal /></div>
//                         </div>
//                         <div className="stat-card secondary-card paid-count">
//                             <div className="text-container">
//                                 <div className="label">تۆمارێن پارەداین</div>
//                                 <div className="value">{dashboardData.paidCount}</div>
//                             </div>
//                             <div className="icon-container"><IconPaid /></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;
