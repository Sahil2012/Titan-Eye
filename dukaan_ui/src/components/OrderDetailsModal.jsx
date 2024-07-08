import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

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

  if (!isOpen || !orderDetails) {
    return null;
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 min-w-[500px]">
      <div className="bg-white p-4 rounded-lg shadow-lg gap-8">
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
        <button
          onClick={onClose}
          className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
