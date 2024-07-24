import React, { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import * as XLSX from "xlsx";

const OrderDetailsModal = ({ orderId, isOpen, onClose }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    if (!orderId) return;

    const q = query(
      collection(db, "order_details"),
      where("billReferenceNumber", "==", orderId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        setOrderDetails(querySnapshot.docs[0].data());
      } else {
        setOrderDetails(null);
      }
    });

    return () => unsubscribe();
  }, [db, orderId]);

  const handleDownload = () => {
    if (!orderDetails) return;

    // Convert order details to Excel format
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Bill No", "Date", "Dealer Name", "Town", "Stock Type"],
      [
        orderDetails.billReferenceNumber,
        orderDetails.date,
        orderDetails.dealerName,
        orderDetails.city,
        orderDetails.stockType,
      ],
      [],
      ["S.No", "SKU Code", "Price", "Quantity", "Total Price"],
      ...orderDetails.products.map((product, index) => [
        index + 1,
        product.skuCode,
        product.price_per_unit,
        product.quantity,
        product.total_price,
      ]),
      [],
      ["Total Quantity", "Total UCP", "LESS", "Discount", "Total Value"],
      [
        orderDetails.totalQuantity,
        orderDetails.totalCost,
        `${orderDetails.discount} %`,
        orderDetails.discountValue,
        orderDetails.totalValue,
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");

    XLSX.writeFile(workbook, `Order_Details_${orderDetails.billReferenceNumber}.xlsx`);
  };

  if (!isOpen || !orderDetails) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg gap-8 min-w-[500px] w-[90vw] h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="flex justify-between">
          <div>Bill.No : {orderDetails.billReferenceNumber}</div>
          <div>Date : {orderDetails.date}</div>
        </div>
        <div>Dealer Name : {orderDetails.dealerName}</div>
        <div className="flex justify-between">
          <div>Town : {orderDetails.city}</div>
          <div>Stock Type : {orderDetails.stockType}</div>
        </div>
        <div className="my-4">
          <div className="flex justify-around font-medium bg-blue-500 text-white py-2 border-b-2 border-x-2">
            <div className="mr-10 w-[5px]">S.no.</div>
            <div className="mr-10 w-[100px]">SKU Code</div>
            <div className="mr-10 w-[50px]">Price</div>
            <div className="mr-10 w-[20px]">Quantity</div>
            <div>Total Price</div>
          </div>
          {orderDetails.products &&
            orderDetails.products.map((product, index) => (
              <div
                key={index}
                className="flex py-2 px-2 font-medium border-b-2 border-x-2 justify-around"
              >
                <div className="mr-10 w-[5px]">{index + 1}</div>
                <div className="mr-10 w-[100px]">{product.skuCode}</div>
                <div className="mr-10 w-[50px]">₹{product.price_per_unit}</div>
                <div className="mr-10 w-[20px]">{product.quantity}</div>
                <div>₹{product.total_price}</div>
              </div>
            ))}
        </div>
        <div className="gap-4">
          <div>Total Quantity : {orderDetails.totalQuantity}</div>
          <div>Total UCP : ₹{orderDetails.totalCost}</div>
          <div>LESS : {orderDetails.discount} %</div>
          <div>Discount : ₹{orderDetails.discountValue}</div>
          <div>Total Value : ₹{orderDetails.totalValue}</div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDownload}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
