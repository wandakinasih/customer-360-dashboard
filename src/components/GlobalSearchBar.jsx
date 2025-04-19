import React, { useState, useEffect } from 'react';

function GlobalSearchBar({ customers, onCustomerSelect, currentCustomerId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers([]);
    } else {
      const filtered = customers.filter(customer => 
        customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleCustomerSelect = (customer) => {
    onCustomerSelect(customer);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg border px-3 py-2 w-full">
        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>
      
      {showResults && filteredCustomers.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.customer_id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                customer.customer_id === currentCustomerId ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleCustomerSelect(customer)}
            >
              <div className="font-medium">{customer.first_name} {customer.last_name}</div>
              <div className="text-xs text-gray-500">ID: {customer.customer_id}</div>
            </div>
          ))}
        </div>
      )}
      
      {showResults && searchTerm && filteredCustomers.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500">
          No customers found
        </div>
      )}
    </div>
  );
}

export default GlobalSearchBar;