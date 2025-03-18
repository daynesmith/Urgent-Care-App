import { useState, useContext } from 'react';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

import {useNavigate} from 'react-router-dom'
import { UserContext } from '../context/Usercontext';

function LoginPage() {
  const navigate = useNavigate()
  const { setRole } = useContext(UserContext)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate email
    if (!formData.email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email is not valid';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        try {
          const response = await axios.post(`${apiUrl}/users/login`, formData);
          console.log('Form Submitted Successfully:', response.data);
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("role", response.data.userRole)
          setRole(response.data.userRole)
          navigate('/dashboard')
        } catch (error) {
          alert(error.response.data);
          console.error('There was an error submitting the form:', error);
        }
    }
  };

  return (
    <div className="bg-[#F8F9FA] m-4 p-8 shadow rounded-lg sm:mx-auto sm:w-full sm:max-w-md mt-8">
      <h1 className="text-4xl font-serif text-center mb-8">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-1">
            Email address
          </label>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm ring-1 focus:outline-sky-500 focus:border-sky-500 focus:ring--sky-500 my-2"
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm ring-1 focus:outline-sky-500 focus:border-sky-500 focus:ring--sky-500 my-2"

          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <button type="submit" className="w-full flex justify-center py-2 px-4 border mt-4 border-transparent rounded-md shadow-sm text-sm font-medium bg-[#17A2B8] hover:bg-[#0e7180] focus:outline-none focus:ring-2 focus:ring-offset-2">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
