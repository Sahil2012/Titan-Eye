import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import "../firebaseConfig.js";
import TableRowItem from "../components/TableRowItem.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AppBar from "../components/AppBar.jsx";

export default function AddClients() {
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");

  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, "client"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() });
      });
      setClients(clientsData);
    });

    return () => unsubscribe();
  }, []);

  const addClientToDb = async () => {
    if (clientName != "") {
      const clientExists = clients.some(
        (client) => client.name === clientName
      );

      if (clientExists) {
        alert("Client with this Name already exists.");
        return; // Exit the function if the product already exists
      }
      try {
        const clientCollection = collection(db, "client");
        const op = await addDoc(clientCollection, { name: clientName });
        let cl = [...clients];
        cl.push({ name: clientName, id: op.id });
        setClients(cl);
      } catch (error) {
        alert("Something went wrong try to add later.");
      }
    } else {
      alert("Enter Client name to add.");
    }
  };
  return (
    <>
      <div className="w-[300px] my-6 ml-[100px]">
        <div className="grow flex justify-center gap-4">
          <div
            className={`grow text-grey-500  flex items-center 
              bg-grey-300 border-2
              px-2 py-2 rounded-lg`}
          >
            <input
              className="bg-inherit items-center text-sm grow focus:outline-none"
              type="text"
              placeholder="Enter Client Name"
              onChange={(e) => {
                setClientName(e.target.value);
              }}
            />
          </div>
          <button
            className="flex justify-center items-center border-1 rounded-lg py-2 px-2 font-semibold bg-blue-500 text-white"
            onClick={addClientToDb}
          >
            Add Client
          </button>
        </div>
      </div>
      <div className="ml-[100px] mb-2">
        <div className="flex  w-[70vw] items-start font-medium bg-blue-500 text-white py-2 px-2">
          <div className="mr-10 w-[20px]">S.No. </div>
          <div>Name </div>
        </div>
        <div></div>
        {clients.map((c, index) => (
          <div
            key={c.id}
            className="flex  w-[70vw] py-2 px-2 font-medium border-b-2 border-x-2"
          >
            <div className="mr-10 w-[20px]">{index + 1} </div>
            <div>{c.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
