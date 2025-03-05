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
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
