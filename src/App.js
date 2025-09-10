import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';
import { saveTomar, deleteTomar, payFull, addPartialPayment } from './services/firebaseService';
import { useTomaran } from './hooks/useTomaran';
import Controls from './components/Controls';
import TomaranList from './components/TomaranList';
import FormModal from './components/FormModal';
import WeneModal from './components/WeneModal';
import PartialPayModal from './components/PartialPayModal';
import Dashboard from './components/Dashboard';
import Pagination from './components/Pagination';
import ReportTemplate from './components/ReportTemplate';
const ITEMS_PER_PAGE = 12;

function App() {
    const {
        tomaran, filteredTomaran, isLoading,
        searchTerm, setSearchTerm,
        activeFilter, setActiveFilter,
        activeSort, setActiveSort,
        fetchTomaran
    } = useTomaran();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [weneToShow, setWeneToShow] = useState(null);
    const [isPartialPayModalOpen, setIsPartialPayModalOpen] = useState(false);
    const [selectedTomar, setSelectedTomar] = useState(null);
    const [editingTomar, setEditingTomar] = useState(null);


    const reportComponentRef = useRef();

    const handleGeneratePDF = () => {
        if (filteredTomaran.length === 0) {
            alert("هیچ تۆمارەک نینە بۆ دروستکرنا PDF!");
            return;
        }

        const element = reportComponentRef.current;
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        
        const opt = {
          margin:       0.5,
          filename:     `Raporta-Tomaran-${dateStr}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    const handleSave = async (tomarData, id) => {
        await saveTomar(tomarData, id);
        await fetchTomaran();
    };

    const handleDelete = async (id) => {
        if (window.confirm("تو یێ پشتراستی دێ ڤی تۆمارێ ژێبەى؟")) {
            await deleteTomar(id);
            await fetchTomaran();
        }
    };
    
    const handlePayFull = async (tomar) => {
        await payFull(tomar);
        await fetchTomaran();
    };

    const handlePartialPaymentSubmit = async (kojme) => {
        if (!selectedTomar) return;
        await addPartialPayment(selectedTomar.id, selectedTomar.pare_hati_dan, kojme);
        setIsPartialPayModalOpen(false);
        setSelectedTomar(null);
        await fetchTomaran();
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredTomaran.slice(indexOfFirstItem, indexOfLastItem);
    
    return (
        <>
            <header className="app-header"><h1>سیستەمێ فرۆتنێ</h1></header>
            
            <main className="main-container">
                <Controls
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onClearSearch={() => setSearchTerm('')}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    activeSort={activeSort}
                    onSortChange={setActiveSort}
                    onGeneratePDF={handleGeneratePDF}
                    onAddNew={() => { setEditingTomar(null); setIsFormModalOpen(true); }}
                />

                <TomaranList
                    isLoading={isLoading}
                    currentItems={currentItems}
                    onDelete={handleDelete}
                    onPayFull={handlePayFull}
                    onPartialPay={(tomar) => { setSelectedTomar(tomar); setIsPartialPayModalOpen(true); }}
                    onShowImage={setWeneToShow}
                    onEdit={(tomar) => { setEditingTomar(tomar); setIsFormModalOpen(true); }}
                />
                
                <Pagination 
                    totalItems={filteredTomaran.length} 
                    itemsPerPage={ITEMS_PER_PAGE} 
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                />
                
                {!isLoading && tomaran.length > 0 && <Dashboard tomaran={tomaran} />}
            </main>
            
            <FormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                onSave={handleSave} 
                editingTomar={editingTomar} 
            />
            <WeneModal 
                weneUrl={weneToShow} 
                onClose={() => setWeneToShow(null)} 
            />
            {selectedTomar && (
                <PartialPayModal 
                    isOpen={isPartialPayModalOpen} 
                    onClose={() => setIsPartialPayModalOpen(false)} 
                    tomar={selectedTomar} 
                    onSubmit={handlePartialPaymentSubmit} 
                />
            )}

            <div style={{ position: 'absolute', left: '-9999px' }}>
                <ReportTemplate ref={reportComponentRef} tomaran={filteredTomaran} />
            </div>
        </>
    );
}

export default App;