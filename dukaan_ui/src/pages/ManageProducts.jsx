import { Edit } from "@mui/icons-material";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [stockNo, setStockNo] = useState("");
  const [price, setPrice] = useState("");
  const [openModal, setOpenModal] = useState(false);

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
    console.log(stockNo);
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
        let pl = [...products];
        pl.push({ stock_no: stockNo, price: price, id: stockNo });
        setProducts(pl);
      } catch (error) {
        console.log(error);
        alert("Something went wrong, try to add later.");
      }
      
    } else {
      alert(`Enter ${stockNo !== '' ? 'Price' : 'Stock No'} to add the product`)
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

  return (
    <div>
      <div className="w-[600px] my-6 ml-[100px]">
        <div className="grow flex justify-center gap-4">
          <div
            className={`grow text-grey-500 flex items-center bg-grey-300 border-2 px-2 py-2 rounded-lg`}
          >
            <input
              className="bg-inherit items-center text-sm grow focus:outline-none"
              type="text"
              placeholder="Enter Stock No"
              onChange={(e) => {
                setStockNo(e.target.value);
              }}
            />
          </div>
          <div
            className={`grow text-grey-500 flex items-center bg-grey-300 border-2 px-2 py-2 rounded-lg`}
          >
            <input
              className="bg-inherit items-center text-sm grow focus:outline-none"
              type="number"
              placeholder="Enter Price"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>
          <button
            className="flex justify-center items-center border-1 rounded-lg py-2 px-2 font-semibold bg-blue-500 text-white"
            onClick={addProductToDb}
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="ml-[100px] mb-2">
        <div className="flex w-[40vw] items-start font-medium bg-blue-500 text-white py-2 px-2">
          <div className="mr-10 w-[20px]">S.No. </div>
          <div className="mr-10 w-[180px]">Stock No </div>
          <div>Price </div>
        </div>
        <div></div>
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex w-[40vw] py-2 px-2 font-medium border-b-2 border-x-2"
          >
            <div className="mr-10 w-[20px]">{index + 1} </div>
            <div className="mr-10 w-[180px]">{product.stock_no}</div>
            <div className="mr-10 w-[50px]">₹ {product.price}</div>
            <div
              className="cursor-pointer"
              onClick={() => openProductModal(product)}
            >
              <Edit />
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={openModal}
        onClose={closeProductModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-8"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg">
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
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
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
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={updateProduct}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
            <button
              onClick={closeProductModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
