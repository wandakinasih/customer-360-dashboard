import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function PortfolioPage({ portfolioData, customerData }) {
  // Filter portfolio data for current customer
  const customerPortfolio = useMemo(() => {
    return portfolioData.filter(item => item.customer_id === customerData.customer_id);
  }, [portfolioData, customerData]);

  // Calculate asset allocation for pie chart
  const assetAllocation = useMemo(() => {
    const allocation = {};
    let total = 0;
    
    customerPortfolio.forEach(item => {
      const value = parseFloat(item.current_value);
      if (!isNaN(value)) {
        allocation[item.asset_type] = (allocation[item.asset_type] || 0) + value;
        total += value;
      }
    });
    
    return Object.keys(allocation).map(key => ({
      name: key,
      value: allocation[key],
      percentage: ((allocation[key] / total) * 100).toFixed(2)
    }));
  }, [customerPortfolio]);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Calculate total portfolio value
  const totalPortfolioValue = useMemo(() => {
    return customerPortfolio.reduce((sum, item) => {
      return sum + parseFloat(item.current_value || 0);
    }, 0);
  }, [customerPortfolio]);

  // Performance data (mock data)
  const performanceData = [
    { month: 'Jan', value: 10000 },
    { month: 'Feb', value: 11200 },
    { month: 'Mar', value: 10800 },
    { month: 'Apr', value: 11500 },
    { month: 'May', value: 12300 },
    { month: 'Jun', value: 12100 }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Portfolio Summary</h3>
          <p className="text-3xl font-bold mb-2">${totalPortfolioValue.toLocaleString()}</p>
          <p className="text-green-600">+5.8% YTD</p>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Asset Allocation</h3>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="text-lg font-medium mb-2">Performance</h3>
        <div style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0088FE" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Asset</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Units</th>
                <th className="px-4 py-2 text-left">Purchase Price</th>
                <th className="px-4 py-2 text-left">Current Value</th>
                <th className="px-4 py-2 text-left">Change</th>
              </tr>
            </thead>
            <tbody>
              {customerPortfolio.map((item, index) => {
                const purchaseValue = parseFloat(item.purchase_price) * parseFloat(item.units);
                const currentValue = parseFloat(item.current_value);
                const change = ((currentValue - purchaseValue) / purchaseValue) * 100;
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{item.asset_name}</td>
                    <td className="px-4 py-2">{item.asset_type}</td>
                    <td className="px-4 py-2">{item.units}</td>
                    <td className="px-4 py-2">${parseFloat(item.purchase_price).toFixed(2)}</td>
                    <td className="px-4 py-2">${parseFloat(item.current_value).toFixed(2)}</td>
                    <td className={`px-4 py-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </td>
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

export default PortfolioPage;