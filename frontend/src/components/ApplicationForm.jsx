import React, { useState } from 'react';
import { X } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios';

export default function ApplicationForm({ job, onClose }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dateofbirth: '',
    phonenumber: '',
    email: '',
    password: '',
    qualifications: '',
    certifications: '',
    coverletter: '',
    experience: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      firstname,
      lastname,
      dateofbirth,
      phonenumber,
      email,
      password,
      coverletter,
      qualifications,
      certifications,
      experience,
      street,
      city,
      state,
      zip,
    } = formData;
  
    const stafftype = job.jobtype;


  
    if (!firstname || !lastname || !dateofbirth || !phonenumber || !email || !password || !street || !city || !state || !zip) {
      setError('One of them is empty.');
      return;
    }
  
    setError('');
    setSubmitting(true);
  
    const applicationData = {
      firstname,
      lastname,
      dateofbirth: `${dateofbirth} 00:00:00`,
      phonenumber,
      email,
      password,
      coverletter,
      experience: parseInt(experience, 10),
      qualifications,
      certifications,
      street,
      city,
      state,
      zip,
      stafftype,
    };
  
    try {
      console.log('Sending JSON application data:', applicationData);
      await axios.post(`${apiUrl}/users/sendingApplications`, applicationData);
      
  
      setStatus('Application submitted successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        dateofbirth: '',
        phonenumber: '',
        email: '',
        password: '',
        qualifications: '',
        certifications: '',
        coverletter: '',
        experience: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      });
    } catch (error) {
      console.error('Error creating application:', error);
      setError('Failed to create application.');
    } finally {
      setSubmitting(false);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Apply for {job.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
              />
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
              />
            </div>
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
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
              required
              pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$" 
              title="Phone number must be in the format XXX-XXX-XXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
              Educational Qualifications
            </label>
            <textarea
              id="qualifications"
              name="qualifications"
              value={formData.qualifications}
              rows={3}
              required
              placeholder="List your degrees, educational background, and relevant coursework"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
              Professional Certifications & Licenses
            </label>
            <textarea
              id="certifications"
              name="certifications"
              value={formData.certifications}
              rows={3}
              required
              placeholder="List your professional certifications, licenses, and their validity periods"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="coverletter" className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              id="coverletter"
              name="coverletter"
              value={formData.coverletter}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
              />
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
              />
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
              />
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
                required
                pattern="^\d{5}(-\d{4})?$" 
                title="ZIP code must be in the format XXXXX or XXXXX-XXXX"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {status && <p className="text-green-600">{status}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-white rounded-md ${
                submitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
