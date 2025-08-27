import React, { useState } from 'react';
import './App.css';

// Importkirina servîs û utilîtyan
import { saveTomar, deleteTomar, payFull, addPartialPayment } from './services/firebaseService';
import { exportToPDF } from './utils/pdfGenerator';

// Importkirina hooka تایبەت
import { useTomaran } from './hooks/useTomaran';

// Importkirina Hemû Komponentan
import Controls from './components/Controls';
import TomaranList from './components/TomaranList';
import FormModal from './components/FormModal';
import WeneModal from './components/WeneModal';
import PartialPayModal from './components/PartialPayModal';
import Dashboard from './components/Dashboard';
import Pagination from './components/Pagination';

const ITEMS_PER_PAGE = 12;

function App() {
    // Hooka سەرەکی کو لۆجیکێ داتایان ب رێڤە دبەت
    const {
        tomaran, filteredTomaran, isLoading,
        searchTerm, setSearchTerm,
        activeFilter, setActiveFilter,
        activeSort, setActiveSort,
        fetchTomaran
    } = useTomaran();
    
    // Statên تایبەت ب UI و Modalan
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [weneToShow, setWeneToShow] = useState(null);
    const [isPartialPayModalOpen, setIsPartialPayModalOpen] = useState(false);
    const [selectedTomar, setSelectedTomar] = useState(null);
    const [editingTomar, setEditingTomar] = useState(null);

    // -- Handlers (فەنکشنێن کونترۆلکرنێ) --

    const handleSave = async (tomarData, id) => {
        await saveTomar(tomarData, id);
        await fetchTomaran(); // نووکرنا لیستی
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

    // Pagination Logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredTomaran.slice(indexOfFirstItem, indexOfLastItem);
    
    return (
        <>
            <header className="app-header"><h1>سیستەمێ فرۆتنێ</h1></header>
            
            <main className="container">
                <Controls
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onClearSearch={() => setSearchTerm('')}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    activeSort={activeSort}
                    onSortChange={setActiveSort}
                    onExportPDF={() => exportToPDF(filteredTomaran)}
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
            
            {/* -- Modals -- */}
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
        </>
    );
}

export default App;