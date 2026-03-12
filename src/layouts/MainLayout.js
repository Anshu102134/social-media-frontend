import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // use the Footer component you created

const MainLayout = () => {
    return (
        <div className="main-layout">
            <header>
                <Navbar />
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;