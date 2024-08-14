import React, { useState } from "react";

export default function TableRowItem({
  orderId,
  orderDate,
  orderAmount,
  status,
  orderDetail,
  handleOpenModal
}) {
  // const [localStatus,setLocalStatus] = useState(status);

  return (
    <div className="grid grid-cols-4 text-xs p-2  font-medium border-b-2">
      <div onClick={() => handleOpenModal(orderDetail)} className="text-blue-500 cursor-pointer">{orderId}</div>
      <div>{orderDate}</div>
      <div className="flex justify-end">
        <div>{`₹ ${orderAmount}`}</div>
      </div>
      <div className="flex justify-end">
        <div>
          <div className={`py-1 px-2 border rounded focus:outline-none cursor-pointer ${
              status === "Pending" ? "bg-yellow-500" : status == "Completed" ? "bg-green-500" : "bg-slate-500"
            } text-white`} onClick={() => handleOpenModal(orderDetail)}>
              {status}
          </div>
          
        </div>
      </div>
    </div>
  );
}
