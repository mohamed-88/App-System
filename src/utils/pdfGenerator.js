import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fontBase64 } from './kurdishFont.js';


function processKurdishText(text) {

    return text;
}

function addKurdishFont(doc) {
    try {
        if (!fontBase64 || !fontBase64.trim()) {
            throw new Error("کۆدا Base64 یا فونتی ڤالایە.");
        }
        const font = fontBase64.trim();
        doc.addFileToVFS('Unikurd-Web.ttf', font);
        
        doc.addFont('Unikurd-Web.ttf', 'KurdishFont', 'normal');
        doc.addFont('Unikurd-Web.ttf', 'KurdishFont', 'bold');

        doc.setFont('KurdishFont');

    } catch (error) {
        console.error("کێشە د بارکرنا فونتی دا:", error);
        doc.setFont('Helvetica');
    }
}

const createPDF = (filteredTomaran) => {
    if (!filteredTomaran || filteredTomaran.length === 0) {
        alert("هیچ تۆمارێک نییە بۆ دروستکردن!");
        return null;
    }

    const doc = new jsPDF();
    addKurdishFont(doc);

    const tableColumn = [
        "ناوی کڕیار", "تەلەفۆن", "کود کاڵا", "پارچە", "جهـ", "سایز", "بهای گشتی", "پارەی دانرا", "پارەی مایە"
    ];

    let totalBuha = 0;
    let totalPareDan = 0;
    const tableRows = filteredTomaran.map(tomar => {
        const buha = tomar.buha_gishti || 0;
        const pareDan = tomar.pare_hati_dan || 0;
        totalBuha += buha;
        totalPareDan += pareDan;
        return [
            tomar.nav || '', tomar.telefon || '', tomar.product_code || '',
            tomar.kelupel || '', tomar.cih || '', tomar.sayiz || '',
            buha.toLocaleString(), pareDan.toLocaleString(), (buha - pareDan).toLocaleString()
        ];
    });

    const totalRow = [
        "کۆی گشتی", '', '', '', '', '',
        totalBuha.toLocaleString(), totalPareDan.toLocaleString(), (totalBuha - totalPareDan).toLocaleString()
    ];
    tableRows.push(totalRow);

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        styles: { font: 'KurdishFont', halign: 'right', fontSize: 10 },
        headStyles: { font: 'KurdishFont', fontStyle: 'bold', fillColor: [45, 52, 54], textColor: 255, fontSize: 11 },
        foot: [totalRow],
        footStyles: { font: 'KurdishFont', fontStyle: 'bold', fillColor: [223, 230, 233], textColor: [45, 52, 54] },
        didDrawPage: function (data) {
            doc.setFont('KurdishFont', 'bold');
            doc.setFontSize(20);
            doc.text('ڕاپۆرتا تۆماران', doc.internal.pageSize.getWidth() - data.settings.margin.right, 18, { align: 'right' });
            
            doc.setFont('KurdishFont', 'normal');
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
            doc.text(`رێکەفت: ${dateStr}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
        },
        margin: { top: 30 }
    });

    return doc;
};

export const exportAndSavePDF = (filteredTomaran) => {
    try {
        const doc = createPDF(filteredTomaran);
        if (doc) {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            const fileName = `raporta-tomaran-${dateStr}.pdf`;
            doc.save(fileName);
        }
    } catch (error) {
        console.error("❌ PDF saving error:", error);
        alert(error.message || "کێشەیەک لە دروستکردنی فایل PDF ڕویدا.");
    }
};