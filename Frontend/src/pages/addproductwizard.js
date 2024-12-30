import { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
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

export default function AddProductWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        rentalPrice: '',
        categories: [],
        isForSale: false,
        isForRent: false,
        ownerId: null,
    });

    const [isProductAdded, setIsProductAdded] = useState(false);
    const navigate = useNavigate();

    const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
    const [createProduct, { loading: submitting }] = useMutation(CREATE_PRODUCT);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const parsedUserId = parseInt(storedUserId, 10);
            if (!isNaN(parsedUserId)) {
                setFormData(prevData => ({ ...prevData, ownerId: parsedUserId }));
            } else {
                console.error("Invalid userId in localStorage");
                alert("Failed to retrieve user information. Please log in again.");
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory && !formData.categories.includes(selectedCategory)) {
            setFormData(prevData => ({
                ...prevData,
                categories: [...prevData.categories, selectedCategory]
            }));
        }
    };

    const handleRemoveCategory = (category) => {
        setFormData(prevData => ({
            ...prevData,
            categories: prevData.categories.filter(cat => cat !== category)
        }));
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const handleBack = () => setStep(prevStep => prevStep - 1);

    const validateCurrentStep = () => {
        switch (step) {
            case 1:
                if (!formData.name.trim()) {
                    alert('Please enter a product name');
                    return false;
                }
                if (!formData.isForSale && !formData.isForRent) {
                    alert('Please select at least one option: For Sale or For Rent');
                    return false;
                }
                break;
            case 2:
                if (!formData.description.trim()) {
                    alert('Please enter a product description');
                    return false;
                }
                if (formData.categories.length === 0) {
                    alert('Please select at least one category');
                    return false;
                }
                break;
            case 3:
                if (formData.isForSale && !formData.price) {
                    alert('Please enter a sale price');
                    return false;
                }
                if (formData.isForRent && !formData.rentalPrice) {
                    alert('Please enter a rental price');
                    return false;
                }
                break;
            default:
                console.error('Unexpected step:', step);
                return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        try {
            const createProductInput = {
                name: formData.name,
                description: formData.description,
                price: formData.isForSale ? parseFloat(formData.price) : null,
                rentalPrice: formData.isForRent ? parseFloat(formData.rentalPrice) : null,
                categories: formData.categories,
                isForSale: formData.isForSale,
                isForRent: formData.isForRent,
                ownerId: formData.ownerId,
            };

            const response = await createProduct({
                variables: { createProductInput }
            });

            console.log('Product created:', response.data);
            setIsProductAdded(true); // Mark product as added successfully
        } catch (err) {
            console.error('Error creating product:', err);
            alert('Failed to add product: ' + err.message);
        }
    };

    if (categoriesLoading) return <div className="p-6">Loading categories...</div>;

    const categories = categoriesData?.categories?.map(cat => cat.name) || [];

    if (isProductAdded) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Product Added Successfully!</h1>
                <button
                    onClick={() => navigate('/myproducts')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Go to My Products
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add Product</h1>
            <div className="border rounded-lg p-6 shadow-lg">
                {step === 1 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Step 1: Basic Information</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Enter product name"
                            />
                        </div>
                        <div className="mb-4 flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isForSale"
                                    checked={formData.isForSale}
                                    onChange={handleInputChange}
                                />
                                <span>For Sale</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isForRent"
                                    checked={formData.isForRent}
                                    onChange={handleInputChange}
                                />
                                <span>For Rent</span>
                            </label>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Step 2: Description and Categories</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Enter product description"
                                rows={4}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Categories</label>
                            <select
                                onChange={handleCategoryChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {formData.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-500 px-3 py-1 rounded-full flex items-center gap-2"
                                    >
                                        {category}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(category)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Step 3: Pricing</h2>
                        {formData.isForSale && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Sale Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter sale price"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        )}
                        {formData.isForRent && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Rental Price</label>
                                <input
                                    type="number"
                                    name="rentalPrice"
                                    value={formData.rentalPrice}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter rental price"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            disabled={submitting}
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={submitting}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
