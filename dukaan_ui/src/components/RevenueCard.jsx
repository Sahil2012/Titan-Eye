import React, { useState } from "react";

export default function RevenueCard({ title, warning, amount, orders }) {
  const [showMessage, setShowMessage] = useState(false);

  const handleWarningClick = () => {
    setShowMessage(!showMessage);
    setTimeout(() => {
      setShowMessage(false);
    }, 1000); // Hide message after 5 seconds
  };

  return (
    <div className="flex flex-col shadow-md rounded p-4 cursor-pointer grow mx-2 bg-[#FFFFFF] shadow-[#1A181E]/25 min-w-[300px] mb-2 max-w-[500px] m-5 relative">
      <div className="text-grey-500 flex items-center mb-3">
        <div className="mr-1">{title}</div>
        {warning ? (
          <div onClick={handleWarningClick} className="cursor-pointer relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
            
          </div>
        ) : null}
      </div>
      {showMessage && (
        <div className="absolute top-8 left-6 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg text-sm text-red-500 z-10">
          This data is for last 30 days from the selected date!
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">₹ {amount}</div>
        {orders ? (
          <div className="flex text-blue-500 underline">
            <div>{orders} orders</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
