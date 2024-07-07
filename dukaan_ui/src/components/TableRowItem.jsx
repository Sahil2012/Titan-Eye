import React, { useState } from "react";

export default function TableRowItem({
  orderId,
  orderDate,
  orderAmount,
  status,
  handleStatusChange,
  handleOpenModal
}) {
  // const [localStatus,setLocalStatus] = useState(status);

  return (
    <div className="grid grid-cols-4 text-xs p-2  font-medium border-b-2 cursor-pointer" onClick={() => handleOpenModal(orderId)}>
      <div>{orderId}</div>
      <div>{orderDate}</div>
      <div className="flex justify-end">
        <div>{`₹ ${orderAmount}`}</div>
      </div>
      <div className="flex justify-end">
        <div>
          <select
            value={status}
            onChange={(e) => {
              handleStatusChange(orderId,e.target.value);
            }}
            className={`py-1 px-2 border rounded focus:outline-none cursor-pointer ${
              status === "Pending" ? "bg-yellow-500" : "bg-green-500"
            } text-white`}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
