import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage'; // Import LandingPage
import SignUpForm from './pages/signup';
import SignIn from './pages/signin';
import HomePage from './pages/homepage';
import TransactionsPage from './pages/transactionspage';
import MyProducts from './pages/myproducts';
import UpdateProductPage from './pages/updateproduct';
import AddProductWizard from './pages/addproductwizard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set LandingPage as the first page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/myproducts" element={<MyProducts />} />
        <Route path="/updateproduct" element={<UpdateProductPage />} />
        <Route path="/addproduct" element={<AddProductWizard />} />
      </Routes>
    </Router>
  );
}

export default App;
