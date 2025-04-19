import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ProfilePage from './components/ProfilePage';
import PortfolioPage from './components/PortfolioPage';
import TransactionPage from './components/TransactionPage';
import GlobalSearchBar from './components/GlobalSearchBar';

// Import CSV files directly
import customerProfileCsv from './data/customer_profile.csv';
import portfolioCsv from './data/portfolio.csv';
import transactionsCsv from './data/transactions.csv';

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [customerData, setCustomerData] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load customer profile data
        const profileResponse = await fetch(customerProfileCsv);
        const profileCsv = await profileResponse.text();
        const profileResults = Papa.parse(profileCsv, {
          header: true,
          skipEmptyLines: true
        });

        // Store all customers for search functionality
        setAllCustomers(profileResults.data);
        
        // Set the first customer as default
        setCustomerData(profileResults.data[0]);

        // Load portfolio data
        const portfolioResponse = await fetch(portfolioCsv);
        const portfolioCsvText = await portfolioResponse.text();
        const portfolioResults = Papa.parse(portfolioCsvText, {
          header: true,
          skipEmptyLines: true
        });
        setPortfolioData(portfolioResults.data);

        // Load transaction data
        const transactionResponse = await fetch(transactionsCsv);
        const transactionCsv = await transactionResponse.text();
        const transactionResults = Papa.parse(transactionCsv, {
          header: true,
          skipEmptyLines: true
        });
        setTransactionData(transactionResults.data);

        setLoading(false);
      } catch (err) {
        setError('Error loading data: ' + err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - only runs once after initial render

  const handleCustomerSelect = (customer) => {
    setCustomerData(customer);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading customer data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Customer 360° Dashboard</h1>
            
            
        {customerData && (
            <div className="mt-4 md:mt-0 mb-6">
                <GlobalSearchBar 
                customers={allCustomers} 
                onCustomerSelect={handleCustomerSelect} 
                currentCustomerId={customerData.customer_id}
                />
            </div>
            )}

        {customerData && (
            <div className="mb-2 bg-blue-50 p-2 rounded flex items-center">
            <span className="font-medium">Current Customer:</span>
            <span className="ml-2">{customerData.first_name} {customerData.last_name}</span>
            <span className="ml-2 text-gray-500 text-sm">({customerData.customer_id})</span>
            </div>
        )}

      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'portfolio' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'transactions' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'profile' && customerData && (
          <ProfilePage customerData={customerData} />
        )}
        
        {activeTab === 'portfolio' && (
          <PortfolioPage portfolioData={portfolioData} customerData={customerData} />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionPage transactionData={transactionData} customerData={customerData} />
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;