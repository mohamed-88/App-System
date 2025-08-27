import { useState, useEffect, useCallback } from 'react';
import { getTomaran } from '../services/firebaseService';

export const useTomaran = () => {
    const [tomaran, setTomaran] = useState([]);
    const [filteredTomaran, setFilteredTomaran] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSort, setActiveSort] = useState('newest');

    const fetchTomaran = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getTomaran();
            setTomaran(data);
        } catch (error) {
            console.error("چەوتی د ئینانا داتایان دا: ", error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTomaran();
    }, [fetchTomaran]);

    useEffect(() => {
        let processedList = [...tomaran];
        
        // Filter by Search Term
        if (searchTerm) {
            const lowercasedValue = searchTerm.toLowerCase();
            processedList = processedList.filter(t =>
                (t.nav && t.nav.toLowerCase().includes(lowercasedValue)) ||
                (t.telefon && t.telefon.includes(lowercasedValue)) ||
                (t.product_code && t.product_code.toLowerCase().includes(lowercasedValue))
            );
        }

        // Filter by Payment Status
        if (activeFilter === 'not_paid') {
            processedList = processedList.filter(t => (t.buha_gishti || 0) > (t.pare_hati_dan || 0));
        } else if (activeFilter === 'paid') {
            processedList = processedList.filter(t => (t.buha_gishti || 0) <= (t.pare_hati_dan || 0));
        }

        // Sort
        switch (activeSort) {
            case 'oldest':
                processedList.sort((a, b) => a.dîroka_zêdekirinê.toMillis() - b.dîroka_zêdekirinê.toMillis());
                break;
            case 'most_expensive':
                processedList.sort((a, b) => (b.buha_gishti || 0) - (a.buha_gishti || 0));
                break;
            case 'cheapest':
                processedList.sort((a, b) => (a.buha_gishti || 0) - (b.buha_gishti || 0));
                break;
            case 'newest':
            default:
                processedList.sort((a, b) => b.dîroka_zêdekirinê.toMillis() - a.dîroka_zêdekirinê.toMillis());
                break;
        }

        setFilteredTomaran(processedList);
    }, [tomaran, searchTerm, activeFilter, activeSort]);

    return {
        tomaran,
        filteredTomaran,
        isLoading,
        searchTerm,
        setSearchTerm,
        activeFilter,
        setActiveFilter,
        activeSort,
        setActiveSort,
        fetchTomaran // بۆ نووکرنا داتایان پشتی هەر کارەکی
    };
};