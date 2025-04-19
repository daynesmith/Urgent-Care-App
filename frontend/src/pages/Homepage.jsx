import { useState, useContext } from 'react';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

import {useNavigate} from 'react-router-dom'
import { UserContext } from '../context/Usercontext';
import RegistrationForm from './Registrationpage.jsx';

import { 
    Users, 
    UserCircle, 
    Stethoscope, 
    Calendar, 
    Clock, 
    Phone, 
    Mail,
    Building2,
    UserPlus,
    LogIn,
    Heart,
    Activity,
    ChevronFirst as FirstAid,
    X,
    Eye,
    EyeOff
} from 'lucide-react';
    
    
export default function Homepage(){
    const [showPatientPortal, setShowPatientPortal] = useState(false);
    const [showStaffLogin, setShowStaffLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState(null);

    const [errorMessage, setErrorMessage] = useState(""); // State for error messages


    const navigate = useNavigate()
    const { setRole, setUserId} = useContext(UserContext)

    const handleRegisterNow = () => {
        navigate('/register'); 
    };

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

    const handleSubmitPatient = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
            console.log(apiUrl)
            const response = await axios.post(`${apiUrl}/users/login`, formData);
            console.log('Login response:', response);
            console.log('Form Submitted Successfully:', response.data);
            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("role", response.data.userRole)
            localStorage.setItem("userId", response.data.userId); // User ID (needed for when we need to filter things for users to only see what is theirs)
            
            setUserId(response.data.userId);                      // stores in React context
            setRole(response.data.userRole);

             // Check if the role is 'patient'
             if (response.data.userRole === "patient") {
                console.log("User is a patient.");
                navigate('/dashboard')
                // Perform any actions specific to the patient role here
            } else {
                console.log("You are not a patient!");
                setErrorMessage("Your account does not have patient access.");  // Set the error message
            }
            
            } 
            catch (error) {
            console.error('There was an error submitting the form:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else if (error.message) {
                alert(`Login failed: ${error.message}`);
            } else {
                alert("An unknown error occurred during login.");
            }
            }
        }
    };

    const handleSubmitStaff = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        try {
            console.log(apiUrl);
            const response = await axios.post(`${apiUrl}/users/login`, formData);
            const { accessToken, userRole, userId, userStatus } = response.data;
    
            console.log('Login response:', response);
    
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("role", userRole);
            localStorage.setItem("userId", userId);
            localStorage.setItem("userStatus", userStatus);
    
            setUserId(userId);
            setRole(userRole);
            setStatus(userStatus);
    
            // Check if the user is staff and accepted
            const isStaff = ["doctor", "receptionist", "admin", "specialist"].includes(userRole);
            if (isStaff && userStatus === "accepted") {
                console.log("User is a staff.");
                navigate('/dashboard');
            } else {
                console.log("You are not a staff!");
                setErrorMessage("No staff access or application not accepted.");
            }
    
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.data) {
                alert(error.response.data);
            } else {
                alert(`Login failed: ${error.message || "Unknown error"}`);
            }
        }
    };
    

    const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setActiveTab(id);
    }
    };


    return (
    
    <div className="min-h-screen bg-gray-50">
        {/* Patient Portal Modal */}
        {showPatientPortal && (
           <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-gray backdrop-blur-sm z-50 flex items-center justify-center p-20 border-4 border-black">
            <div className="bg-white bg-opacity-100 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                    <button 
                    onClick={() => setShowPatientPortal(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                    <X className="h-6 w-6" />
                    </button>
                    
                    <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <UserCircle className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Patient Portal</h2>
                    <p className="text-gray-600 mt-2">Access your medical records and appointments</p>
                    </div>

                    <form onSubmit={handleSubmitPatient} className="space-y-6">
                    <div>
                        <label htmlFor="patient-email" className="block text-sm font-medium text-gray-700">
                        Email Address
                        </label>
                        <input
                        type="email"
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="patient@example.com"
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="patient-password" className="block text-sm font-medium text-gray-700">
                        Password
                        </label>
                        <div className="relative">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                            ) : (
                            <Eye className="h-5 w-5" />
                            )}
                        </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign in
                    </button>
                    </form>
                    {/* Display the error message if exists */}
                    {errorMessage && (
                        <div className="text-red-500 mt-4">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        )}
        {/* Staff Login Modal */}
        {showStaffLogin && (
          <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-gray backdrop-blur-sm z-50 flex items-center justify-center p-20 border-4 border-black">
            <div className="bg-white bg-opacity-100 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                    <button 
                    onClick={() => setShowStaffLogin(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                    <X className="h-6 w-6" />
                    </button>

                    <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                    <Stethoscope className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Staff Login</h2>
                    <p className="text-gray-600 mt-2">Access your medical staff portal</p>
                    </div>

                    <form onSubmit={handleSubmitStaff} className="space-y-6">
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                    </label>
                    <input
                    type="email"
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        
                    placeholder="doctor@healthcareclinic.com"
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>

                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                    </label>
                    <div className="relative">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="••••••••"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                        ) : (
                        <Eye className="h-5 w-5" />
                        )}
                    </button>
                    </div>
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>

                    <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                    Sign in
                    </button>
                    </form>
                        {/* Display the error message if exists */}
                        {errorMessage && (
                        <div className="text-red-500 mt-4">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        )}



        {/* Hero Section */}
    <img 
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1200&h=500"
        alt="Medical facility" 
        className="w-full h-[500px] object-cover"
    />
    

    {/* Text directly over the image with no dark background */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
    <h1
        className="text-4xl font-bold mb-4"
        style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.7)' }}
        >
        Welcome to HealthCare Clinic
        </h1>
        <p className="text-xl  font-bold mb-4"
        tyle={{ textShadow: '0px 2px 4px rgba(0,0,0,0.7)' }}
        > Providing Quality Healthcare Services Since 1995</p>
    </div>

        {/* Quick Access Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Patient Portal */}
            <div
            onClick={() => setShowPatientPortal(true)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform">
            <UserCircle className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Patient Portal</h3>
            <p className="text-gray-600 mb-4">Access your medical records and schedule appointments</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full">
                Access Portal
            </button>
            </div>

            {/* Staff Login */}
            <div 
            onClick={() => setShowStaffLogin(true)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform"
            >
            <LogIn className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Staff Login</h3>
            <p className="text-gray-600 mb-4">Secure access for doctors and medical staff</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full">
                Login
            </button>
            </div>

            {/* New Patient Registration */}
            <div 
                onClick={handleRegisterNow}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform">
            <Users className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">New Patients</h3>
            <p className="text-gray-600 mb-4">Register as a new patient and book your first visit</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors w-full">
                Register Now
            </button>
            </div>
        </div>
        </div>
        

        {/* Services Section */}
        <div id="services" className="py-16 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Primary Care</h3>
                <p className="text-gray-600">Comprehensive healthcare for patients of all ages, including routine check-ups and preventive care.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Specialized Care</h3>
                <p className="text-gray-600">Expert care in various medical specialties, including cardiology, pediatrics, and more.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <FirstAid className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Urgent Care</h3>
                <p className="text-gray-600">Immediate medical attention for non-emergency conditions, with extended hours.</p>
            </div>
            </div>
        </div>
        </div>

        {/* About Section */}
        <div id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80" 
                alt="Medical team" 
                className="rounded-lg shadow-lg"
                />
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4">Your Health Is Our Priority</h3>
                <p className="text-gray-600 mb-6">
                For over 25 years, HealthCare Clinic has been providing exceptional medical care to our community. 
                Our team of experienced healthcare professionals is committed to delivering personalized care and 
                ensuring the best possible outcomes for our patients.
                </p>
                <ul className="space-y-4">
                <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                    Board-certified physicians
                </li>
                <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                    State-of-the-art facilities
                </li>
                <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                    Comprehensive care services
                </li>
                </ul>
            </div>
            </div>
        </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <form className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="your@email.com"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your message"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Send Message
                </button>
                </form>
            </div>
            <div className="space-y-6">
                <div>
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <p className="text-gray-600">
                    123 Healthcare Avenue<br />
                    Medical District<br />
                    City, State 12345
                </p>
                </div>
                <div>
                <h3 className="text-xl font-semibold mb-4">Hours</h3>
                <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 8:00 PM<br />
                    Saturday: 9:00 AM - 5:00 PM<br />
                    Sunday: Closed
                </p>
                </div>
                <div>
                <h3 className="text-xl font-semibold mb-4">Contact</h3>
                <p className="text-gray-600">
                    Phone: (555) 123-4567<br />
                    Emergency: (555) 999-9999<br />
                    Email: info@healthcareclinic.com
                </p>
                </div>
            </div>
            </div>
        </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h4 className="text-lg font-semibold mb-4">About Us</h4>
                <p className="text-gray-400">Providing exceptional healthcare services to our community for over 25 years.</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white">Services</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white">About</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white">Contact</button></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Insurance</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Primary Care</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Urgent Care</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Specialized Care</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Lab Services</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <div className="flex space-x-4">
                <Mail className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Phone className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                </div>
            </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 HealthCare Clinic. All rights reserved.</p>
            </div>
        </div>
        </footer>

    </div>
    );
}
