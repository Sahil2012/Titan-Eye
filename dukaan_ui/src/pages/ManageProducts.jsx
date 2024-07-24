import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { Edit } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import * as XLSX from "xlsx";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [stockNo, setStockNo] = useState("");
  const [price, setPrice] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const fileInputRef = useRef(null);

  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productLocal = [];
      querySnapshot.forEach((doc) => {
        productLocal.push({ id: doc.id, ...doc.data() });
      });

      setProducts(productLocal);
    });

    return () => unsubscribe();
  }, [db]);

  const addProductToDb = async () => {
    if (stockNo !== "" && price !== "") {
      const productExists = products.some(
        (product) => product.stock_no === stockNo
      );

      if (productExists) {
        alert("Product with this Stock No already exists.");
        return;
      }
      try {
        const clientCollection = collection(db, "products");
        const productRef = doc(clientCollection, stockNo);
        await setDoc(productRef, { stock_no: stockNo, price: price });
        setProducts((prevProducts) => [
          ...prevProducts,
          { stock_no: stockNo, price: price, id: stockNo },
        ]);
      } catch (error) {
        console.log(error);
        alert("Something went wrong, try to add later.");
      }
    } else {
      alert(
        `Enter ${stockNo !== "" ? "Price" : "Stock No"} to add the product`
      );
    }
  };

  const openProductModal = (product) => {
    setStockNo(product.stock_no);
    setPrice(product.price);
    setOpenModal(true);
  };

  const closeProductModal = () => {
    setOpenModal(false);
  };

  const updateProduct = async () => {
    try {
      const productRef = doc(db, "products", stockNo);
      await setDoc(productRef, { stock_no: stockNo, price: price });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === stockNo ? { ...product, price: price } : product
        )
      );
      closeProductModal();
    } catch (error) {
      console.log(error);
      alert("Something went wrong, try to update later.");
    }
    setStockNo("");
    setPrice("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const newProducts = [];
      let allSuccess = true;

      for (const product of jsonData) {
        const { stock_no, price } = product;
        if (stock_no && price) {
          const productExists = products.some((p) => p.stock_no === stock_no);

          if (!productExists) {
            try {
              const clientCollection = collection(db, "products");
              const productRef = doc(clientCollection, stock_no);
              await setDoc(productRef, { stock_no, price });
              newProducts.push({ stock_no, price, id: stock_no });
            } catch (error) {
              console.error(`Error adding product with Stock No ${stock_no}:`, error);
              allSuccess = false;
              setModalMessage(`Error adding product with Stock No ${stock_no}`);
              setOpenErrorModal(true);
              break;
            }
          }
        }
      }

      if (allSuccess) {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setModalMessage(`Products successfully added from ${file.name}`);
        setOpenSuccessModal(true);
      }

      // Reset the file input value by changing its key
      setFileInputKey(Date.now());
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
          <input
            className="flex-1 bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm"
            type="text"
            placeholder="Enter Stock No"
            value={stockNo}
            onChange={(e) => setStockNo(e.target.value)}
          />
          <input
            className="flex-1 bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm"
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={addProductToDb}
          >
            Add Product
          </button>
          <label className="flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-green-600">
            Upload Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              ref={fileInputRef}
              key={fileInputKey}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center bg-blue-500 text-white py-2 px-4 rounded-t-md">
          <div className="w-1/12 text-center text-xs sm:text-sm md:text-base lg:text-lg">S.No.</div>
          <div className="w-4/12 text-center text-xs sm:text-sm md:text-base lg:text-lg">Stock No</div>
          <div className="w-3/12 text-center text-xs sm:text-sm md:text-base lg:text-lg">Price</div>
          <div className="w-4/12 text-center text-xs sm:text-sm md:text-base lg:text-lg">Actions</div>
        </div>
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center py-2 px-4 border-b border-gray-200"
          >
            <div className="w-1/12 text-center text-xs sm:text-sm md:text-base lg:text-lg">{index + 1}</div>
            <div className="w-4/12 text-center text-xs sm:text-sm md:text-base lg:text-lg truncate">{product.stock_no}</div>
            <div className="w-3/12 text-center text-xs sm:text-sm md:text-base lg:text-lg">₹ {product.price}</div>
            <div className="w-4/12 text-center">
              <button
                onClick={() => openProductModal(product)}
                className="text-blue-500 hover:text-blue-600"
              >
                <Edit />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={openModal}
        onClose={closeProductModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>
          <div className="mb-4">
            <label
              htmlFor="stockNo"
              className="block text-sm font-medium text-gray-700"
            >
              Stock No
            </label>
            <input
              type="text"
              id="stockNo"
              name="stockNo"
              value={stockNo}
              readOnly
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={updateProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={closeProductModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Success</h2>
          <p>{modalMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setOpenSuccessModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{modalMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setOpenErrorModal(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
