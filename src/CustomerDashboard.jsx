// CustomerDashboard.jsx
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
  }, []);

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Customer 360°</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'portfolio' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'transactions' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {customerData && (
            <div className="mb-6">
              <GlobalSearchBar 
                customers={allCustomers} 
                onCustomerSelect={handleCustomerSelect} 
                currentCustomerId={customerData.customer_id}
              />
              <div className="mt-2 bg-blue-50 p-3 rounded flex items-center">
                <span className="font-medium">Current Customer:</span>
                <span className="ml-2">{customerData.first_name} {customerData.last_name}</span>
                <span className="ml-2 text-gray-500 text-sm">({customerData.customer_id})</span>
              </div>
            </div>
          )}
          
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
      </div>
    </div>
  );
}

export default CustomerDashboard;