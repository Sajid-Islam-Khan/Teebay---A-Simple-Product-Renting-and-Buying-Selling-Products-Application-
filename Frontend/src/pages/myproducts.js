import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// GraphQL Query to fetch products by owner
const GET_PRODUCTS_BY_OWNER = gql`
  query GetProductsByOwner($ownerId: Int!) {
    getProductsByOwner(ownerId: $ownerId) {
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

// GraphQL Mutation to delete a product
const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function MyProducts() {
    const ownerId = parseInt(localStorage.getItem('userId'), 10); // Get owner ID from localStorage
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_BY_OWNER, {
        variables: { ownerId },
    });

    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        onCompleted: () => refetch(), // Refetch products after deletion
    });

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/homepage'); // Navigate back to Home Page
    };

    const handleAddProduct = () => {
        navigate('/addproduct'); // Navigate to the Add Product Wizard
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct({ variables: { id: productId } });
                alert('Product deleted successfully.');
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('Failed to delete the product.');
            }
        }
    };

    const handleUpdate = (product) => {
        navigate('/updateproduct', { state: product }); // Navigate to UpdateProductPage with product details
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching your products</div>;

    const products = data.getProductsByOwner;

    // Separate AVAILABLE products to show at the top
    const availableProducts = products.filter(product => product.status === 'AVAILABLE');
    const otherProducts = products.filter(product => product.status !== 'AVAILABLE');

    // Concatenate to put available products first
    const sortedProducts = [...availableProducts, ...otherProducts];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Products</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleBack}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleAddProduct}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Product
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                {sortedProducts.map((product) => (
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
                        <div className="flex gap-4 mt-4">
                            {/* Delete button only for AVAILABLE products */}
                            {product.status !== 'SOLD' && product.status !== 'RENTED' && (
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            )}
                            {product.status === 'AVAILABLE' && (
                                <button
                                    onClick={() => handleUpdate(product)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyProducts;
