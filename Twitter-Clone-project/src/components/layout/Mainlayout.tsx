"use client";
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import LoadingSpinner from '../loading-spinner';

import Sidebar from './Sidebar';
import Rightsidebar from './Rightsidebar'; // <-- import your right sidebar
import ProfilePage from '../ProfilePage';

const Mainlayout = ({ children }: any) => {
    const { user, isloading } = useAuth();
    const [currentPage, setCurrentPage] = useState('Home');

    if (isloading) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-black'>
                <div className='text-center'>
                    <div className='text-white text-4xl font-bold mb-4'></div>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className='min-h-screen bg-black text-white flex'>
            {/* Left Sidebar */}
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

            {/* Main Content */}
            <main className='flex-1 border-x border-gray-800 max-w-2xl'>
                {currentPage=== "profile"? <ProfilePage/> :children}
            </main>

            {/* Right Sidebar */}
            <Rightsidebar /> {/* <-- added here */}
        </div>
    );
};

export default Mainlayout;
