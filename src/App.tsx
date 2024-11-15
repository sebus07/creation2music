import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Legal from './pages/Legal';
import Success from './pages/Success';
import AudioPlayer from './components/AudioPlayer';

const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "EUR",
  intent: "capture"
};

function App() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
        <AudioPlayer />
        <Toaster position="bottom-right" />
      </div>
    </PayPalScriptProvider>
  );
}

export default App;