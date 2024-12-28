import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_BOUGHT_PRODUCTS = gql`
  query GetBoughtProducts($buyerId: Int!) {
    getBoughtProductsByUser(buyerId: $buyerId) {
      id
      name
      description
      price
      rentalPrice
      status
      categories {
        name
      }
    }
  }
`;

const GET_SOLD_PRODUCTS = gql`
  query GetSoldProducts($ownerId: Int!) {
    getSoldProductsByOwner(ownerId: $ownerId) {
      id
      name
      description
      price
      rentalPrice
      status
      categories {
        name
      }
    }
  }
`;

const GET_RENTED_PRODUCTS = gql`
  query GetRentedProducts($ownerId: Int!) {
    getRentedProductsByOwner(ownerId: $ownerId) {
      id
      name
      description
      price
      rentalPrice
      status
      categories {
        name
      }
    }
  }
`;

const GET_BORROWED_PRODUCTS = gql`
  query GetBorrowedProducts($renterId: Int!) {
    getBorrowedProductsByUser(renterId: $renterId) {
      id
      name
      description
      price
      rentalPrice
      status
      categories {
        name
      }
    }
  }
`;

function TransactionsPage() {
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('bought'); // Default tab is 'bought'

    const { data: boughtData, loading: boughtLoading } = useQuery(GET_BOUGHT_PRODUCTS, {
        variables: { buyerId: parseInt(userId) },
        skip: activeTab !== 'bought', // Only fetch data when this tab is active
    });

    const { data: soldData, loading: soldLoading } = useQuery(GET_SOLD_PRODUCTS, {
        variables: { ownerId: parseInt(userId) },
        skip: activeTab !== 'sold', // Only fetch data when this tab is active
    });

    const { data: rentedData, loading: rentedLoading } = useQuery(GET_RENTED_PRODUCTS, {
        variables: { ownerId: parseInt(userId) },
        skip: activeTab !== 'rented', // Only fetch data when this tab is active
    });

    const { data: borrowedData, loading: borrowedLoading } = useQuery(GET_BORROWED_PRODUCTS, {
        variables: { renterId: parseInt(userId) },
        skip: activeTab !== 'borrowed', // Only fetch data when this tab is active
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            navigate('/signin'); // Redirect if user is not logged in
        } else {
            setUserId(storedUserId);
        }
    }, [navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleHomeClick = () => {
        navigate('/homepage'); // Navigate back to the home page
    };

    if (boughtLoading || soldLoading || rentedLoading || borrowedLoading) return <div>Loading...</div>;

    const renderProducts = (products) => {
        if (products.length === 0) return <div>No products to display.</div>;

        return products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md mb-4">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                {product.rentalPrice && <p>Rental Price: ${product.rentalPrice}</p>}
                <p>Status: {product.status}</p>
                <div className="flex gap-2 mt-2">
                    {product.categories.map((category, index) => (
                        <span key={index} className="bg-blue-100 text-blue-500 px-2 py-1 rounded text-sm">
                            {category.name}
                        </span>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div className="p-6">
            <button
                onClick={handleHomeClick}
                className="mb-6 bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
                Home
            </button>

            <h1 className="text-2xl font-bold mb-4">My Transactions</h1>

            <div className="flex mb-6 gap-4">
                <button
                    onClick={() => handleTabChange('bought')}
                    className={`${activeTab === 'bought' ? 'bg-blue-500' : 'bg-gray-300'
                        } text-white font-bold py-2 px-4 rounded`}
                >
                    Bought
                </button>
                <button
                    onClick={() => handleTabChange('sold')}
                    className={`${activeTab === 'sold' ? 'bg-blue-500' : 'bg-gray-300'
                        } text-white font-bold py-2 px-4 rounded`}
                >
                    Sold
                </button>
                <button
                    onClick={() => handleTabChange('rented')}
                    className={`${activeTab === 'rented' ? 'bg-blue-500' : 'bg-gray-300'
                        } text-white font-bold py-2 px-4 rounded`}
                >
                    Rented
                </button>
                <button
                    onClick={() => handleTabChange('borrowed')}
                    className={`${activeTab === 'borrowed' ? 'bg-blue-500' : 'bg-gray-300'
                        } text-white font-bold py-2 px-4 rounded`}
                >
                    Borrowed
                </button>
            </div>

            <div>
                {activeTab === 'bought' && renderProducts(boughtData.getBoughtProductsByUser)}
                {activeTab === 'sold' && renderProducts(soldData.getSoldProductsByOwner)}
                {activeTab === 'rented' && renderProducts(rentedData.getRentedProductsByOwner)}
                {activeTab === 'borrowed' && renderProducts(borrowedData.getBorrowedProductsByUser)}
            </div>
        </div>
    );
}

export default TransactionsPage;
