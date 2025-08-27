import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Îkonên SVG
const IconTotal = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const IconDebt = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const IconRevenue = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const IconPaid = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

function Dashboard({ tomaran }) {
    const dashboardData = useMemo(() => {
        let totalDebt = 0, totalRevenue = 0, paidCount = 0, notPaidCount = 0;
        tomaran.forEach(tomar => {
            const buha = tomar.buha_gishti || 0;
            const pareDan = tomar.pare_hati_dan || 0;
            const pareMayi = buha - pareDan;
            totalRevenue += pareDan;
            if (pareMayi > 0) { totalDebt += pareMayi; notPaidCount++; } else { paidCount++; }
        });
        return { totalTomaran: tomaran.length, totalDebt, totalRevenue, paidCount, notPaidCount };
    }, [tomaran]);

    const chartData = {
        labels: ['قەردار', 'پارەداین'],
        datasets: [{ data: [dashboardData.notPaidCount, dashboardData.paidCount], backgroundColor: ['#e94560', '#00712f'], borderColor: '#16213e', borderWidth: 4, hoverOffset: 10 }],
    };
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#f0f0f0', padding: 20, font: { size: 14, family: "'Poppins', sans-serif" } } } },
        cutout: '75%'
    };

    return (
        <div className="dashboard-section">
            <h2 className="dashboard-title">کورتەیا ئاماران</h2>
            
            {/* --- STRUKTURÊ NOO YÊ GRID --- */}
            <div className="dashboard-grid">
                {/* STÛNA SEREKÎ (HERO CARDS) */}
                <div className="hero-stats">
                    <div className="stat-card hero-card debt">
                        <div className="text-container">
                            <div className="label">کۆژمێ گشتی یێ قەرزان</div>
                            <div className="value">{dashboardData.totalDebt.toLocaleString()} IQD</div>
                        </div>
                        <div className="icon-container"><IconDebt /></div>
                    </div>
                    <div className="stat-card hero-card revenue">
                        <div className="text-container">
                            <div className="label">کۆژمێ پارەیێ وەرگرتی</div>
                            <div className="value">{dashboardData.totalRevenue.toLocaleString()} IQD</div>
                        </div>
                        <div className="icon-container"><IconRevenue /></div>
                    </div>
                </div>

                {/* GRAF Û KARTÊN PIÇÛK */}
                <div className="side-stats">
                    <div className="chart-container">
                        <Doughnut data={chartData} options={chartOptions} />
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
            </div>
        </div>
    );
}

export default Dashboard;