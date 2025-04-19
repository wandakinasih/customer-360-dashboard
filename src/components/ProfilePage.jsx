import React from 'react';

function ProfilePage({ customerData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-center mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-bold text-blue-600">
                {customerData.first_name?.[0]}{customerData.last_name?.[0]}
              </span>
            </div>
            <h3 className="text-xl font-semibold">
              {customerData.first_name} {customerData.last_name}
            </h3>
            <p className="text-gray-500">Customer since: {customerData.join_date}</p>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-medium text-gray-500 mb-1">Contact Information</h4>
              <p><strong>Email:</strong> {customerData.email}</p>
              <p><strong>Phone:</strong> {customerData.phone}</p>
              <p><strong>Address:</strong> {customerData.address}</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-medium text-gray-500 mb-1">Personal Details</h4>
              <p><strong>Date of Birth:</strong> {customerData.date_of_birth}</p>
              <p><strong>Occupation:</strong> {customerData.occupation}</p>
              <p><strong>Employer:</strong> {customerData.employer}</p>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <h4 className="font-medium text-gray-500 mb-1">Financial Profile</h4>
            <p><strong>Annual Income:</strong> ${customerData.annual_income}</p>
            <p><strong>Credit Score:</strong> {customerData.credit_score}</p>
            <p><strong>Risk Level:</strong> {customerData.risk_level}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;