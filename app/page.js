"use client"
import React, { useState } from "react";
import { db } from "./firebase/config";
import { collection, addDoc } from "firebase/firestore";
import HomePage from "@/pages/homePage";
import Chatbot from "@/components/ChatBot";

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const docRef = await addDoc(collection(db, "message"), {
  //       name,
  //       email,
  //       message
  //     });
  //     console.log("Document written with ID:", docRef.id);

  //     // clear form after submit
  //     setName("");
  //     setEmail("");
  //     setMessage("");
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };
 return (
 <> 
 <HomePage />
  <Chatbot/></>
 );
}

export default Home;