// pages/medicine-store.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import MedicineStore from '../components/MedicineStore/MedicineStore';

export default function MedicineStorePage() {
  return (
    <>
      <Head>
        <title>Medicine Store | BookMyDoc</title>
        <meta name="description" content="Buy medicines online with BookMyDoc" />
      </Head>
      <MedicineStore />
    </>
  );
}