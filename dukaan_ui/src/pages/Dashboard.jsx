import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import AppBar from "../components/AppBar";
import RevenueCard from "../components/RevenueCard";
import UtilityIcons from "../components/UtilityIcons";
import OvalButtons from "../components/OvalButtons";
import TableHead from "../components/TableHead";
import TableRowItem from "../components/TableRowItem";
import SearchBar from "../components/SearchBar";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import useDebounce from "../hooks/useDebounce";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function Dashboard() {
  const db = getFirestore();
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderSearch,setOrderSearch] = useState('');
  const debounceSearchId = useDebounce(orderSearch,500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);


  /*
  useEffect(() => {
    const q = query(collection(db, "orders"), where("date","==",filterDate), orderBy("date", "desc") );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });
    console.log(filterDate);
    return () => unsubscribe();
  }, [filterDate]);
  */

  const handleOpenModal = (orderId) => {
    setSelectedOrder(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    // console.log(orderSearch);
    let q = null;
    if(orderSearch != '') {
      q = query(collection(db, "orders"), where("billReferenceNumber","==",orderSearch));
      
    } else {
      q = query(collection(db, "orders"), where("date","==",filterDate), orderBy("date", "desc") );
    }
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });
    // console.log(filterDate);
    return () => unsubscribe();
  },[filterDate,debounceSearchId]);

  const handleStatusChange = async (id, newStatus) => {
    const orderDoc = doc(db, 'orders', id);
    
    console.log('called' + id + newStatus);
    const op = await updateDoc(orderDoc, { status: newStatus});
    console.log(op);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="flex relative">
      <div className="grow">

        <div className="flex pt-8 flex-wrap">
            <RevenueCard title={'Amount Pending'} warning={true} amount={92301.2} orders={13}/>
            <RevenueCard title={'Amount Pending'} warning={true} amount={92301.2} orders={13}/>
            <RevenueCard title={'Amount Processed'} warning={true} amount={213456.72}/>
        </div>
        <div className="mt-4 mx-2 p-4">
          <div className="flex justify-between items-center my-2">
            <div>
              <SearchBar
                placeHolder={"Search by order ID..."}
                bgColor={"bg-grey-300"}
                setOrderSearch={setOrderSearch}
              />
            </div>
            <div className="mb-4">
        <input
          type="date"
          id="filterDate"
          className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterDate}
          onChange={(e) => {setFilterDate(e.target.value); setOrderSearch('');}}
        />
      </div>
          </div>
          <TableHead orderIcon={true} feesIcon={true} />
          {orders.map((order) => (
            <TableRowItem
              key={order.id}
              orderId={order.billReferenceNumber}
              orderDate={order.date}
              orderAmount={order.totalCost}
              status={order.status}
              handleStatusChange={handleStatusChange}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </div>
        <OrderDetailsModal 
          orderId={selectedOrder}
          isOpen = {isModalOpen}
          onClose= {handleCloseModal}
        />
      </div>
    </div>
  );
}
