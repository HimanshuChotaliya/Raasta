import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Journey from './pages/Journey';
import Profile from './pages/Profile';
import Monitor from './pages/Monitor';
import './index.css';

// A simple layout component to conditionally render Navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  // We can hide navbar on specific pages if needed, but for now we show it everywhere
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/monitor" element={<Monitor />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
