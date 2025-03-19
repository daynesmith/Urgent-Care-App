import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

function RegistrationForm() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    email: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    email: '',
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
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password should be at least 6 characters';
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try{
        const response = await axios.post(`${apiUrl}/users/register`,formData);
        alert("Registation Successful")
        navigate('/login')
      } catch(error) {
        alert(error.response.data)
      }
      
    }
  };

  return (
    <div className="bg-[#F8F9FA] m-4 p-8 shadow rounded-lg sm:mx-auto sm:w-full sm:max-w-md mt-8">
      <h2 className="text-4xl font-serif text-center mb-8">Register your account</h2>
      <form onSubmit={handleSubmit}>

        <div>
          <label className="block text-sm font-medium text-gray-700 mt-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm ring-1 focus:outline-sky-500 focus:border-sky-500 focus:ring--sky-500 my-2"
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" >Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm ring-1 focus:outline-sky-500 focus:border-sky-500 focus:ring--sky-500 my-2"
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" >Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm ring-1 focus:outline-sky-500 focus:border-sky-500 focus:ring--sky-500 my-2"
          />
          {errors.confirmPassword && (
            <p style={{ color: 'red' }}>{errors.confirmPassword}</p>
          )}
        </div>

        <button type= "submit" className="w-full flex justify-center py-2 px-4 border mt-4 border-transparent rounded-md shadow-sm text-sm font-medium bg-[#17A2B8] hover:bg-[#0e7180] focus:outline-none focus:ring-2 focus:ring-offset-2">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
