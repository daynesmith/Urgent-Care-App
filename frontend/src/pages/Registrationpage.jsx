import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL

function RegistrationForm() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    email: '',
    firstname: '',
    lastname: '',
    dateofbirth: '',
    phonenumber: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate('/'); 
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    const requiredFields = [
      'firstname',
      'lastname',
      'dateofbirth',
      'phonenumber',
      'email',
      'password',
      'confirmPassword',
      'street',
      'city',
      'state',
      'zip',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

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

    // Validate phone number
    if (formData.phonenumber && !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(formData.phonenumber)) {
      formErrors.phonenumber = 'Phone number must be in the format XXX-XXX-XXXX';
      isValid = false;
    }

    // Validate ZIP code
    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      formErrors.zip = 'ZIP code must be in the format XXXXX or XXXXX-XXXX';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try{
        await axios.post(`${apiUrl}/users/register`,formData);
        alert("Registation Successful")
        //navigate('/Homepage')
      } catch(error) {
        alert(error.response.data);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-md relative">

        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Register Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.firstname && <p className="text-red-600 text-sm mt-1">{errors.firstname}</p>}
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.lastname && <p className="text-red-600 text-sm mt-1">{errors.lastname}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="dateofbirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateofbirth"
              name="dateofbirth"
              value={formData.dateofbirth}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.dateofbirth && (
              <p className="text-red-600 text-sm mt-1">{errors.dateofbirth}</p>
            )}
          </div>

          <div>
            <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
              pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
              title="Phone number must be in the format XXX-XXX-XXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.phonenumber && (
              <p className="text-red-600 text-sm mt-1">{errors.phonenumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                pattern="^\d{5}(-\d{4})?$"
                title="ZIP code must be in the format XXXXX or XXXXX-XXXX"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.zip && <p className="text-red-600 text-sm mt-1">{errors.zip}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 px-4 text-white rounded-md ${
              submitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );  

}

export default RegistrationForm;
