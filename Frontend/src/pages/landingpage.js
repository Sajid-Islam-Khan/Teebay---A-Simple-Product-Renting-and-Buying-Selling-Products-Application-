import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup'); // Navigate to the sign-up page
    };

    const handleSignIn = () => {
        navigate('/signin'); // Navigate to the sign-in page
    };

    return (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center">
            <div className="text-center text-white px-6 py-12">
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to <span className="text-yellow-400">Teebay</span>
                </h1>
                <p className="text-xl mb-6">
                    The simplest platform for renting, buying, and selling products. Whether you want to buy, rent, or sell, we’ve got you covered.
                </p>
                <div className="flex justify-center gap-8 mb-8">
                    <button
                        onClick={handleSignUp}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition duration-300"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={handleSignIn}
                        className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-full transition duration-300"
                    >
                        Sign In
                    </button>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Why Teebay?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="bg-white text-black p-6 rounded-xl shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Buy Products</h3>
                            <p className="text-sm">
                                Shop for a variety of products at affordable prices, all with a secure payment system.
                            </p>
                        </div>
                        <div className="bg-white text-black p-6 rounded-xl shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Rent Products</h3>
                            <p className="text-sm">
                                Rent anything from electronics to furniture for a flexible period and save money.
                            </p>
                        </div>
                        <div className="bg-white text-black p-6 rounded-xl shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Sell Products</h3>
                            <p className="text-sm">
                                List your used items and earn money by selling products to buyers who need them.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="mt-12">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Teebay. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
