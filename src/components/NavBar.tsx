"use client";

import Link from 'next/link';
import { useState } from 'react';
import OrderModal from './OrderModal';

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 max-w-container-max mx-auto left-0 right-0">
        <div className="flex items-center gap-12">
          <Link className="font-display-lg text-[24px] tracking-tight text-on-background font-black" href="/">
            부산생수배달
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link className="hidden md:inline-flex items-center justify-center font-label-sm tracking-widest text-on-background hover:text-primary transition-colors" href="/admin/login">
            관리자 로그인
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center bg-primary text-on-primary px-6 py-3 font-label-sm tracking-widest hover:bg-on-background transition-colors duration-300"
          >
            생수배달 신청
          </button>
          <button className="md:hidden text-on-background p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
