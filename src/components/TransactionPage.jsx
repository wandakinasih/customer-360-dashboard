import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TransactionPage({ transactionData, customerData }) {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transaction data for current customer
  const customerTransactions = useMemo(() => {
    return transactionData.filter(item => item.customer_id === customerData.customer_id);
  }, [transactionData, customerData]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = [...customerTransactions];
    
    if (filterType !== 'all') {
      result = result.filter(item => item.transaction_type === filterType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.description.toLowerCase().includes(term) ||
        item.transaction_type.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [customerTransactions, filterType, searchTerm]);

  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const categories = {};
    
    customerTransactions
      .filter(item => item.transaction_type === 'debit')
      .forEach(item => {
        const category = item.category || 'Uncategorized';
        const amount = Math.abs(parseFloat(item.amount));
        categories[category] = (categories[category] || 0) + amount;
      });
    
    return Object.keys(categories).map(category => ({
      name: category,
      amount: categories[category]
    }));
  }, [customerTransactions]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="text-lg font-medium mb-2">Spending by Category</h3>
        <div style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spendingByCategory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div>
            <select
              className="border rounded px-2 py-1"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
              <option value="transfer">Transfers</option>
            </select>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="border rounded px-3 py-1 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const amount = parseFloat(transaction.amount);
                const isDebit = transaction.transaction_type === 'debit';
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{transaction.date}</td>
                    <td className="px-4 py-2">{transaction.description}</td>
                    <td className="px-4 py-2">{transaction.category || '-'}</td>
                    <td className="px-4 py-2">{transaction.transaction_type}</td>
                    <td className={`px-4 py-2 ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
                      {isDebit ? '-' : '+'}${Math.abs(amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">${parseFloat(transaction.balance).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;