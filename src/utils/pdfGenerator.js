import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// بتنێ ئێک فەنکشن بۆ دروستکرنا PDF
export const exportToPDF = async (filteredTomaran) => {
    if (filteredTomaran.length === 0) {
        alert("هیچ تۆمارەک نینە بۆ دەرئینانێ!");
        return;
    }

    try {
        const doc = new jsPDF();

        // 3. دانانا سەردێرێ راپۆرتێ
        doc.setFontSize(18);
        doc.text("ڕاپۆرتا تۆماران", 200, 15, { align: 'right' });

        // 4. ئامادەکرنا داتایێن خشتەی
        const tableColumn = [
            "پارەیێ مای", "پارەیێ هاتیە دان", "بهایێ گشتی", "سایز",
            "جهـ", "پارچە", "کودێ کاڵای", "تەلەفۆن", "ناڤێ کڕیاری"
        ];
        const tableRows = filteredTomaran.map(tomar => {
            const buha = tomar.buha_gishti || 0;
            const pareDan = tomar.pare_hati_dan || 0;
            return [
                (buha - pareDan).toLocaleString(), pareDan.toLocaleString(), buha.toLocaleString(),
                tomar.sayiz || '', tomar.cih || '', tomar.kelupel || '',
                tomar.product_code || '', tomar.telefon || '', tomar.nav || ''
            ];
        });

        // 5. دروستکرنا خشتەی
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            styles: { font: 'NotoNaskh', halign: 'right' },
            headStyles: {
                font: 'NotoNaskh',
                fillColor: [41, 128, 185],
                textColor: 255
            },
        });

        doc.save("raporta_tomaran.pdf");

    } catch (error) {
        console.error("کێشە د دروستکرنا PDF دا پەیدابوو: ", error);
        alert("کێشەیەک د دروستکرنا فایلێ PDF دا رویدا. هیڤیدارین سەیری کۆنسۆلی بکە.");
    }
};