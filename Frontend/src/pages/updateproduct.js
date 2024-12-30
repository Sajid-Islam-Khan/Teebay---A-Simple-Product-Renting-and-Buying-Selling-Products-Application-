import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, gql, useQuery } from '@apollo/client';
import Select from 'react-select';

// GraphQL Mutation to update a product
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $updateProductInput: UpdateProductInput!) {
    updateProduct(id: $id, updateProductInput: $updateProductInput) {
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

// GraphQL Query to get all categories
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

function UpdateProductPage() {
    const { state } = useLocation(); // Product details passed via state
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: state?.id,
        name: state?.name || '',
        description: state?.description || '',
        price: state?.price || 0,
        rentalPrice: state?.rentalPrice || 0,
        isForSale: state?.isForSale || false,
        isForRent: state?.isForRent || false,
        categories: state?.categories.map((cat) => cat.name) || [], // Store category names
    });

    const [categoriesList, setCategoriesList] = useState([]);

    // Fetch all categories using the query
    const { data: categoriesData, loading, error } = useQuery(GET_CATEGORIES);

    useEffect(() => {
        if (categoriesData) {
            setCategoriesList(categoriesData.categories);
        }
    }, [categoriesData]);

    const [updateProduct] = useMutation(UPDATE_PRODUCT);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send category names as strings (not IDs)
        try {
            await updateProduct({
                variables: {
                    id: formData.id, // Make sure id is passed as a separate variable
                    updateProductInput: {
                        name: formData.name,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        rentalPrice: parseFloat(formData.rentalPrice),
                        isForSale: formData.isForSale,
                        isForRent: formData.isForRent,
                        categories: formData.categories,  // Send category names as strings
                    },
                },
            });
            alert('Product updated successfully!');
            navigate('/myproducts'); // Redirect back to MyProducts page
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update the product.');
        }
    };

    // If categories are loading, show a loading message
    if (loading) return <div>Loading categories...</div>;
    if (error) return <div>Error fetching categories.</div>;

    // Prepare options for the Select dropdown (react-select)
    const categoryOptions = categoriesList.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    // Prepare the selected categories for the dropdown
    const selectedCategoryOptions = formData.categories.map((catName) => {
        const category = categoriesList.find((category) => category.name === catName);
        return category ? { value: category.id, label: category.name } : null;
    }).filter(Boolean);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Update Product</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="border rounded p-2"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="border rounded p-2"
                    required
                />
                <input
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleChange}
                    placeholder="Rental Price"
                    className="border rounded p-2"
                />
                <div className="flex items-center gap-2">
                    <label>
                        <input
                            type="checkbox"
                            name="isForSale"
                            checked={formData.isForSale}
                            onChange={handleChange}
                        />
                        For Sale
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="isForRent"
                            checked={formData.isForRent}
                            onChange={handleChange}
                        />
                        For Rent
                    </label>
                </div>

                {/* Dropdown for categories */}
                <Select
                    isMulti
                    name="categories"
                    options={categoryOptions}
                    value={selectedCategoryOptions}
                    onChange={(selectedOptions) => {
                        const updatedCategories = selectedOptions.map(option => option.label);
                        setFormData({
                            ...formData,
                            categories: updatedCategories,
                        });
                    }}
                    placeholder="Select Categories"
                    className="border rounded p-2"
                />

                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default UpdateProductPage;
