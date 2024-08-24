import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getFirestore,
  updateDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import * as XLSX from "xlsx";

const OrderDetailsModal = ({
  orderDetails,
  isOpen,
  onClose,
  handleStatusChange,
}) => {
  // console.log(orderDetails);

  if (!isOpen || !orderDetails) {
    return null;
  }

  // console.log(orderDetails);

  const [products, setProducts] = useState(orderDetails.products);
  const [allStatus,setAllStatus] = useState(true);

  const handleDownload = () => {
    if (!orderDetails) return;

    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Bill No", "Date", "Dealer Name", "Town", "Stock Type"],
      [
        orderDetails.billReferenceNumber,
        orderDetails.date.toDate().toISOString().split("T")[0],
        orderDetails.dealerName,
        orderDetails.city,
        orderDetails.stockType,
      ],
      [],
      ["S.No", "SKU Code", "Price", "Quantity", "Total Price", "Status"],
      ...orderDetails.products.map((product, index) => [
        index + 1,
        product.skuCode,
        product.price_per_unit,
        product.quantity,
        product.total_price,
        product.status,
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
      orderDetails.stockType === "Sample Frame" && [
        "Disclaimer : Please note that the total value indicated above is an approximate amount. As this is a sample, the final value may vary.",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");

    XLSX.writeFile(
      workbook,
      `Order_Details_${orderDetails.billReferenceNumber}.xlsx`
    );
  };

  const updateProductDetails = (skuCode, newStatus) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.skuCode === skuCode
          ? { ...product, status: newStatus }
          : product
      )
    );
  };

  const handleUpdateClick = async () => {
    const db = getFirestore();
    const orderRef = doc(db, "order_details", orderDetails.billReferenceNumber); // Assuming the document ID is the bill reference number

    // Update products array in Firestore and calculate new order status
    const updatedProducts = products;

    const newOrderStatus = updatedProducts.every(
      (product) => product.status === "Completed"
    )
      ? "Completed"
      : "Pending";

    // Update the entire order document, including products array and status
    await updateDoc(orderRef, {
      products: updatedProducts,
      status: newOrderStatus,
    });

    // Optionally, you can close the modal after updating
    onClose();
  };

  const toggleAllProductsStatus = () => {
    let newStatus = allStatus ? "Pending" : "Completed";

    setProducts((prevProducts) =>
      prevProducts.map((product) => ({ ...product, status: newStatus }))
    );

    setAllStatus(!allStatus);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[80vw] h-[70vh] max-w-screen-lg max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between">
            <div>Bill No: {orderDetails.billReferenceNumber}</div>
            <div>
              Date: {orderDetails.date.toDate().toISOString().split("T")[0]}
            </div>
          </div>
          <div>Dealer Name: {orderDetails.dealerName}</div>
          <div className="flex justify-between">
            <div>Town: {orderDetails.city}</div>
            <div>Stock Type: {orderDetails.stockType}</div>
          </div>
        </div>

        <div className="my-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  S.No.
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  SKU Code
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Total Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products &&
                products.map((product, index) => (
                  <tr key={index} className="bg-grey-700">
                    <td className="px-4 py-2 text-sm font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      {product.skuCode}
                    </td>
                    <td className="px-4 py-2 text-sm text-center font-medium">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      ₹{product.price_per_unit}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      ₹{product.total_price}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      <select
                        value={product.status}
                        disabled={orderDetails.status === "Rejected"}
                        onChange={(e) =>
                          updateProductDetails(product.skuCode, e.target.value)
                        }
                        className={`py-1 px-2 border rounded focus:outline-none cursor-pointer ${
                          product.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        } text-white`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="my-4">
          <button
            onClick={toggleAllProductsStatus}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Mark as {allStatus ? 'Pending' : 'Completed'}
          </button>
        </div>

        <div className="gap-4 mb-4">
          <div>Total Quantity: {orderDetails.totalQuantity}</div>
          <div>Total UCP: ₹{orderDetails.totalCost}</div>
          <div>LESS: {orderDetails.discount} %</div>
          <div>Discount: ₹{orderDetails.discountValue}</div>
          <div>Total Value: ₹{orderDetails.totalValue}</div>
          {orderDetails.stockType === "Sample Frame" && (
            <div className="font-bold text-red-500">
              Disclaimer:{" "}
              <span className="text-red-500">
                {" "}
                Please note that the total value indicated above is an
                approximate amount. As this is a sample, the final value may
                vary.{" "}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <button
              onClick={handleDownload}
              className="py-2 px-4 mx-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Download
            </button>

            <button
              className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700"
              onClick={handleUpdateClick}
            >
              Update
            </button>
          </div>

          <div>
            <button
              onClick={() => {
                handleStatusChange(
                  orderDetails.billReferenceNumber,
                  "Rejected"
                );
                onClose();
              }}
              className="py-2 px-4 mx-2 bg-grey-500 text-white rounded hover:bg-[#4d4d4db4]"
            >
              Reject
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
    </div>
  );
};

export default OrderDetailsModal;
