import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/signup';
import SignIn from './pages/signin';
import HomePage from './pages/homepage';
import TransactionsPage from './pages/transactionspage'; // Import the TransactionsPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionsPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
