import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import TableHead from "../components/TableHead";
import TableRowItem from "../components/TableRowItem";
import UtilityIcons from "../components/UtilityIcons";
import RevenueCard from "../components/RevenueCard";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  where,
  Timestamp
} from "firebase/firestore";
import useDebounce from "../hooks/useDebounce";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { addDays, endOfDay, format, roundToNearestHours, startOfDay, subDays } from "date-fns";  // Import date-fns for date manipulation
import OvalButtons from "../components/OvalButtons";

export default function Dashboard() {
  const db = getFirestore();
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date());
  const [orderSearch, setOrderSearch] = useState("");
  const debounceSearchId = useDebounce(orderSearch, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeComplete,setActiveComplete] = useState(true);
  const [activePending,setActivePending] = useState(true);
  const [completeCount,setCompleteCount] = useState(0);
  const [pendingCount,setPendingCount] = useState(0);
  const [processedAmount,setAmountProcessed] = useState(0);
  const [pendingAmount,setAmountPending] = useState(0);
  const [rejectedCount,setRejectedCount] = useState(0);
  const [activeRejected,setActiveRejected] = useState(true);

  // Calculate the date 30 days ago from the selected date
  const getStartDate = () => {
    return subDays(filterDate, 30);
  };

  useEffect(() => {
    let q = null;
    const startDate = startOfDay(getStartDate());
    const endDate = startOfDay(addDays(filterDate,1));    

    if (orderSearch !== "") {
      q = query(
        collection(db, "order_details"),
        where("billReferenceNumber", "==", orderSearch)
      );
    } else {      
      q = query(
        collection(db, "order_details"),
        where("date", ">=", Timestamp.fromDate(startDate)), // Use Firestore Timestamp
        where("date", "<", Timestamp.fromDate(endDate)),   // Use Firestore Timestamp
        orderBy("date", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      let comp = 0;
      let pen = 0;
      let procAmt = 0;
      let penAmt = 0;
      let rej = 0;
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
        if(doc.data().status == 'Completed') {
          procAmt += doc.data().totalCost;
          comp ++;
        } else if(doc.data().status == 'Rejected'){
          rej ++;
        } else {
          penAmt += doc.data().totalCost;
          pen ++;
        }
      });
      setRejectedCount(rej);
      setAmountPending(penAmt);
      setAmountProcessed(procAmt);
      setCompleteCount(comp);
      setPendingCount(pen);
      setOrders(ordersData);
      // console.log(orders);
      
    });

    return () => unsubscribe();
  }, [filterDate, debounceSearchId]);

  const handleStatusChange = async (id, newStatus) => {
    const orderDoc = doc(db, "orders", id);
    await updateDoc(orderDoc, { status: newStatus });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleOpenModal = (orderDetail) => {
    
    setSelectedOrder(orderDetail);
    console.log(orderDetail);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const filterCompleted = () => {
    console.log("Comp");
    setActiveComplete(!activeComplete);
    // setActivePending(false);
  }

  const filterPending = () => {
    console.log("Pen");
    // setCompleteCount(0);
    setActivePending(!activePending);
    // setActiveComplete(false);
  }

  const filterRejected = () => {
    console.log("Rej");
    setActiveRejected(!activeRejected);
    
  }
  return (
    <div className="flex relative">
      <div className="grow">
        <div className="mt-4 mx-2 p-4">
        <div className="flex mb-4">
          <RevenueCard title={"Amount Processed"} amount={processedAmount} orders={completeCount} warning={true}/>
          <RevenueCard title={"Amount Pending"} amount={pendingAmount} orders={pendingCount} warning={true}/>
        </div>
          
        <div className="flex gap-4 items-center">
          <OvalButtons text={"Completed"} count={completeCount} bgColor={`${activeComplete ? 'bg-blue-500' : 'bg-grey-700'}`} filterMe={filterCompleted} />
          <OvalButtons text={"Pending"} count={pendingCount} bgColor={`${activePending ? 'bg-blue-500' : 'bg-grey-700'}`} filterMe={filterPending}/>
          <OvalButtons text={"Rejected"} count={rejectedCount} bgColor={`${activeRejected ? 'bg-blue-500' : 'bg-grey-700'}`} filterMe={filterRejected}/>
        </div>
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
                value={filterDate.toISOString().split("T")[0]}  // Bind to selected date
                onInput={(e) => {
                  setFilterDate(new Date(e.target.value));  // Update filterDate
                  setOrderSearch("");
                }}
                
              />  
            </div>
          </div>
          <TableHead orderIcon={false} feesIcon={true} />
          {orders.length !== 0 ? orders.map((order) => (
            order.status == 'Completed' ? activeComplete && 
            <TableRowItem
              key={order.id}
              orderId={order.billReferenceNumber}
              orderDate={order.date.toDate().toISOString().split("T")[0]} // Display formatted date
              orderAmount={order.totalCost}
              status={order.status}
              orderDetail={order}
              handleOpenModal={handleOpenModal}
            /> : activePending && 
            <TableRowItem
              key={order.id}
              orderId={order.billReferenceNumber}
              orderDate={order.date.toDate().toISOString().split("T")[0]} // Display formatted date
              orderAmount={order.totalCost}
              status={order.status}
              orderDetail={order}
              handleOpenModal={handleOpenModal}
            />
          )) : <div className="bg-gray-300 justify-center flex py-4 text-[#ffffff]">No Records to show</div>}
        </div>
        <OrderDetailsModal
          orderDetails={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
