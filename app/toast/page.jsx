"use client";

import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast.success('Here is your toast.');

const ToastPage = () => {
  return (
    <div className='mt-26'>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};

export default ToastPage;