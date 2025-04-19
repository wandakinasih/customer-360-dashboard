// PortfolioPage.jsx
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function PortfolioPage({ portfolioData, customerData }) {
  const [activeTab, setActiveTab] = useState('funding');
  
  // Filter portfolio data for current customer
  const customerPortfolio = useMemo(() => {
    return portfolioData.filter(item => item.customer_id === customerData.customer_id);
  }, [portfolioData, customerData]);

  // Filter by product type
  const fundingProducts = useMemo(() => 
    customerPortfolio.filter(item => item.product_type === 'FUNDING'), 
    [customerPortfolio]
  );
  
  const lendingProducts = useMemo(() => 
    customerPortfolio.filter(item => item.product_type === 'LENDING'), 
    [customerPortfolio]
  );
  
  const wealthProducts = useMemo(() => 
    customerPortfolio.filter(item => item.product_type === 'WEALTH'), 
    [customerPortfolio]
  );

  // Calculate totals
  const fundingTotal = useMemo(() => 
    fundingProducts.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0), 
    [fundingProducts]
  );
  
  const lendingTotal = useMemo(() => 
    lendingProducts.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0), 
    [lendingProducts]
  );
  
  const wealthTotal = useMemo(() => 
    wealthProducts.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0), 
    [wealthProducts]
  );
  
  const totalPortfolioValue = fundingTotal + lendingTotal + wealthTotal;

  // Prepare data for charts
  const allocationData = [
    { name: 'Funding', value: fundingTotal },
    { name: 'Lending', value: lendingTotal },
    { name: 'Wealth', value: wealthTotal }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
      
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'funding' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('funding')}
        >
          Funding
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'lending' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('lending')}
        >
          Lending
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'wealth' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('wealth')}
        >
          Wealth
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold mb-2">${totalPortfolioValue.toLocaleString()}</p>
          <div className="flex justify-between">
            <span className="text-sm">Funding: ${fundingTotal.toLocaleString()}</span>
            <span className="text-sm">Lending: ${lendingTotal.toLocaleString()}</span>
            <span className="text-sm">Wealth: ${wealthTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Portfolio Allocation</h3>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {activeTab === 'funding' && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="text-lg font-medium mb-4">Funding Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium mb-2">CASA (Current & Savings Accounts)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Account</th>
                      <th className="px-4 py-2 text-left">Account Number</th>
                      <th className="px-4 py-2 text-left">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundingProducts
                      .filter(item => item.product_category === 'CASA')
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2">{item.account_number}</td>
                          <td className="px-4 py-2">${parseFloat(item.balance).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Deposits</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Maturity Date</th>
                      <th className="px-4 py-2 text-left">Balance</th>
                      <th className="px-4 py-2 text-left">Interest Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundingProducts
                      .filter(item => item.product_category === 'TIME_DEPOSIT')
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2">{item.maturity_date || '-'}</td>
                          <td className="px-4 py-2">${parseFloat(item.balance).toLocaleString()}</td>
                          <td className="px-4 py-2">{item.interest_rate}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lending' && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="text-lg font-medium mb-4">Lending Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium mb-2">Secured Loans</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Loan Type</th>
                      <th className="px-4 py-2 text-left">Balance</th>
                      <th className="px-4 py-2 text-left">Interest Rate</th>
                      <th className="px-4 py-2 text-left">Maturity Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lendingProducts
                      .filter(item => item.product_category === 'SECURED')
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2">${parseFloat(item.balance).toLocaleString()}</td>
                          <td className="px-4 py-2">{item.interest_rate}%</td>
                          <td className="px-4 py-2">{item.maturity_date}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Unsecured Loans</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Loan Type</th>
                      <th className="px-4 py-2 text-left">Balance</th>
                      <th className="px-4 py-2 text-left">Interest Rate</th>
                      <th className="px-4 py-2 text-left">Maturity Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lendingProducts
                      .filter(item => item.product_category === 'UNSECURED')
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2">${parseFloat(item.balance).toLocaleString()}</td>
                          <td className="px-4 py-2">{item.interest_rate}%</td>
                          <td className="px-4 py-2">{item.maturity_date}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wealth' && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="text-lg font-medium mb-4">Wealth Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium mb-2">Mutual Funds & Bonds</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Balance</th>
                      <th className="px-4 py-2 text-left">Interest Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wealthProducts
                      .filter(item => ['MUTUAL_FUNDS', 'BONDS'].includes(item.product_category))
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2">
                            {item.product_category === 'MUTUAL_FUNDS' ? 'Mutual Fund' : 'Bond'}
                          </td>
                          <td className="px-4 py-2">${parseFloat(item.balance).toLocaleString()}</td>
                          <td className="px-4 py-2">{item.interest_rate || '-'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Gold & Insurance</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wealthProducts
                      .filter(item => ['GOLD', 'BANCA_INSURANCE'].includes(item.product_category))
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2">
                            {item.product_category === 'GOLD' ? 'Gold' : 'Insurance'}
                          </td>
                          <td className="px-4 py-2">${parseFloat(item.balance).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;