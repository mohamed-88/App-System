import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';

const API_KEY = 'fab3567ee61f24dd8bca7e7d';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

function CurrencyConverter( ) {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IQD');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [result, setResult] = useState(0);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          setExchangeRate(data.conversion_rates.IQD);
        } else {
          console.error('Error fetching exchange rate:', data['error-type']);
        }
      })
      .catch(error => console.error('Error fetching API:', error));
  }, []);

  useEffect(() => {
    if (exchangeRate === 0) return;

    let convertedAmount;
    if (fromCurrency === 'USD') {
      convertedAmount = amount * exchangeRate;
    } else {
      convertedAmount = amount / exchangeRate;
    }
    setResult(convertedAmount.toFixed(2));

  }, [amount, fromCurrency, toCurrency, exchangeRate]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== '') {
      setAmount(parseFloat(value));
    } else if (value === '') {
        setAmount('');
        setResult(0);
    }
  };

  const handleFromCurrencyChange = (e) => {
    const newFrom = e.target.value;
    const newTo = newFrom === 'USD' ? 'IQD' : 'USD';
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  };

  const handleToCurrencyChange = (e) => {
    const newTo = e.target.value;
    const newFrom = newTo === 'USD' ? 'IQD' : 'USD';
    setToCurrency(newTo);
    setFromCurrency(newFrom);
  };

  return (
    <div className="currency-converter-card">
      <h4>گوهارتنا دراڤان</h4>
      <div className="converter-body">
        <div className="input-group">
          <label>ژ</label>
          <input 
            type="number" 
            value={amount} 
            onChange={handleAmountChange} 
            className="amount-input"
          />
          <select value={fromCurrency} onChange={handleFromCurrencyChange}>
            <option value="USD">USD</option>
            <option value="IQD">IQD</option>
          </select>
        </div>
        <div className="equals-sign">=</div>
        <div className="input-group">
          <label>بۆ</label>
          {/* --- RASTKIRIN LI VÊRÊ --- */}
          <input 
            type="text" /* 'd' hat jêbirin */
            value={result} 
            readOnly 
            className="result-input"
          />
          <select value={toCurrency} onChange={handleToCurrencyChange}>
            <option value="USD">USD</option>
            <option value="IQD">IQD</option>
          </select>
        </div>
      </div>
      <div className="rate-info">
        نرخێ نوکە: 1 USD = {exchangeRate.toFixed(2)} IQD
      </div>
    </div>
  );
}

export default CurrencyConverter;
