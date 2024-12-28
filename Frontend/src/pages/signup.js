import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const SIGNUP_MUTATION = gql`
  mutation Signup($signupInput: CreateUserInput!) {
    signup(signupInput: $signupInput)
  }
`;

function SignUpForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
    const navigate = useNavigate(); // Use navigate hook

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'firstName':
                newErrors.firstName = value.trim() === '' ? 'First name is required' : '';
                break;
            case 'lastName':
                newErrors.lastName = value.trim() === '' ? 'Last name is required' : '';
                break;
            case 'email':
                newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
                break;
            case 'phoneNumber':
                newErrors.phoneNumber = /^[0-9]{10,15}$/.test(value)
                    ? ''
                    : 'Phone number must be 10-15 digits';
                break;
            case 'password':
                newErrors.password = value.length < 6 ? 'Password must be at least 6 characters' : '';
                break;
            case 'confirmPassword':
                newErrors.confirmPassword =
                    value !== formData.password ? 'Passwords do not match' : '';
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        validate(name, value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Perform final validation for all fields
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            validate(key, formData[key]);
            if (formData[key].trim() === '') {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        });

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some((error) => error !== '');
        if (hasErrors) {
            return; // Do not proceed with submission
        }

        try {
            const { data } = await signup({
                variables: { signupInput: formData },
            });
            console.log('Signup Successful:', data);
            alert('Signup Successful!');

            // Redirect to the signin page after successful signup
            navigate('/signin'); // Redirect to /signin page after signup
        } catch (e) {
            console.error('Signup Error:', e);
            alert('Error during signup. Please check your details.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl font-bold mb-4 text-center">SIGN UP</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs italic">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs italic">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phoneNumber ? 'border-red-500' : ''
                                }`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <div className="flex items-center">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="ml-2 text-sm text-blue-500"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs italic">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <div className="flex items-center">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="ml-2 text-sm text-blue-500"
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {error && <p className="text-red-500 text-xs italic mt-2">Error: {error.message}</p>}
                {data && <p className="text-green-500 text-xs italic mt-2">{data.signup}</p>}

                <div className="text-center mt-4">
                    <p>Already have an account?
                        <button
                            onClick={() => navigate('/signin')}
                            className="text-blue-500 hover:text-blue-700">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;
