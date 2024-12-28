import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';

// GraphQL Query to fetch all products
const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      id
      name
      description
      price
      rentalPrice
      isForSale
      isForRent
      status
      categories {
        name
      }
    }
  }
`;

// GraphQL Mutation to buy a product
const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: Int!, $buyerId: Int!) {
    buyProduct(productId: $productId, buyerId: $buyerId) {
      id
      status
    }
  }
`;

// GraphQL Mutation to rent a product
const RENT_PRODUCT = gql`
  mutation RentProduct($productId: Int!, $renterId: Int!, $rentDuration: Int!) {
    rentProduct(productId: $productId, renterId: $renterId, rentDuration: $rentDuration) {
      id
      status
    }
  }
`;

function HomePage() {
    const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);
    const [buyProduct] = useMutation(BUY_PRODUCT);
    const [rentProduct] = useMutation(RENT_PRODUCT);
    const [showConfirm, setShowConfirm] = useState(null); // For showing confirmation pop-up
    const [actionType, setActionType] = useState(null); // To track if it's 'buy' or 'rent'
    const [selectedProductId, setSelectedProductId] = useState(null); // Selected product id for action
    const [rentDuration, setRentDuration] = useState(0); // Rent duration for renting

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Clear the userId from localStorage
        navigate('/signin'); // Redirect to the sign-in page
    };

    const handleTransactions = () => {
        navigate('/transactions'); // Navigate to the transactions page
    };

    const handleBuy = (productId) => {
        setSelectedProductId(productId);
        setActionType('buy');
        setShowConfirm(true);
    };

    const handleRent = (productId) => {
        setSelectedProductId(productId);
        setActionType('rent');
        setShowConfirm(true);
    };

    const handleConfirmAction = async () => {
        const buyerId = parseInt(localStorage.getItem('userId')); // Get buyer/renter ID from localStorage
        if (actionType === 'buy') {
            await buyProduct({ variables: { productId: selectedProductId, buyerId } });
        } else if (actionType === 'rent') {
            if (rentDuration > 0) {
                await rentProduct({ variables: { productId: selectedProductId, renterId: buyerId, rentDuration } });
            } else {
                alert('Please enter a valid rent duration.');
                return;
            }
        }
        setShowConfirm(false); // Close the confirmation pop-up
    };

    const handleCancelAction = () => {
        setShowConfirm(false); // Close the confirmation pop-up
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching products</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleTransactions}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        My Transactions
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">List of All Products</h2>
            <div className="flex flex-col gap-6">
                {data.getAllProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-md">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        {product.isForRent && <p>Rental Price: ${product.rentalPrice}</p>}
                        <p>Status: {product.status}</p>
                        <div className="flex gap-2 mt-2">
                            {product.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-500 px-2 py-1 rounded text-sm"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>

                        {product.status !== 'SOLD' && product.status !== 'RENTED' && (
                            <div className="mt-4">
                                {product.isForSale && (
                                    <button
                                        onClick={() => handleBuy(product.id)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Buy
                                    </button>
                                )}
                                {product.isForRent && (
                                    <button
                                        onClick={() => handleRent(product.id)}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
                                    >
                                        Rent
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h3 className="font-bold text-lg mb-4">
                            Are you sure you want to {actionType} this product?
                        </h3>
                        {actionType === 'rent' && (
                            <div className="mb-4">
                                <label htmlFor="rentDuration" className="block text-sm">Enter Rent Duration (in days):</label>
                                <input
                                    type="number"
                                    id="rentDuration"
                                    value={rentDuration}
                                    onChange={(e) => setRentDuration(e.target.value)}
                                    className="border rounded px-2 py-1 w-full mt-2"
                                />
                            </div>
                        )}
                        <div className="flex justify-between">
                            <button
                                onClick={handleConfirmAction}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={handleCancelAction}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
