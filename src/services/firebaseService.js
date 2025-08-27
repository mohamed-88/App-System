import { db } from '../firebaseConfig';
import { collection, getDocs, orderBy, query, addDoc, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const tomaranCollectionRef = collection(db, "tomaran");

// ئینانا هەمی تۆماران
export const getTomaran = async () => {
    const q = query(tomaranCollectionRef, orderBy("dîroka_zêdekirinê", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

// زێدەکرن یان نووکرنا تۆمارەکی
export const saveTomar = async (tomarData, id) => {
    if (id) {
        const tomarDoc = doc(db, "tomaran", id);
        await updateDoc(tomarDoc, tomarData);
    } else {
        const dataToSave = { 
            ...tomarData, 
            dîroka_zêdekirinê: Timestamp.fromDate(new Date()), 
            pare_hati_dan: 0 
        };
        await addDoc(tomaranCollectionRef, dataToSave);
    }
};

// ژێبرنا تۆمارەکی
export const deleteTomar = async (id) => {
    const tomarDoc = doc(db, "tomaran", id);
    await deleteDoc(tomarDoc);
};

// دانانا پارەی ب تەمامەتی
export const payFull = async (tomar) => {
    const tomarDoc = doc(db, "tomaran", tomar.id);
    await updateDoc(tomarDoc, { pare_hati_dan: tomar.buha_gishti });
};

// زێدەکرنا پارەیەکێ کێم
export const addPartialPayment = async (tomarId, currentPaidAmount, newAmount) => {
    const tomarDoc = doc(db, "tomaran", tomarId);
    const newPaidAmount = (currentPaidAmount || 0) + newAmount;
    await updateDoc(tomarDoc, { pare_hati_dan: newPaidAmount });
};