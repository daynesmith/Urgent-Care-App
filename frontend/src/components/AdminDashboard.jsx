import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, FileText, Settings, Bell, Plus, Search, ChevronDown,
  Activity, DollarSign, UserPlus, Clock, BarChart2, Filter, Download, CheckCircle, XCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
//npm install framer-motion
import { format, subDays } from 'date-fns';



// Enhanced mock data
const appointments = [
  { id: 1, patient: "Sarah Johnson", time: "09:00 AM", status: "Confirmed", type: "Check-up", doctor: "Dr. Smith" },
  { id: 2, patient: "Mike Smith", time: "10:30 AM", status: "Pending", type: "Follow-up", doctor: "Dr. Brown" },
  { id: 3, patient: "Emma Davis", time: "02:00 PM", status: "Completed", type: "Consultation", doctor: "Dr. Wilson" },
];

const patients = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    age: 34, 
    lastVisit: "2024-03-10",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    insurance: "BlueCross",
    balance: 150.00
  },
  { 
    id: 2, 
    name: "Mike Smith", 
    age: 45, 
    lastVisit: "2024-03-08",
    email: "mike.s@email.com",
    phone: "(555) 234-5678",
    insurance: "Aetna",
    balance: 0.00
  },
  { 
    id: 3, 
    name: "Emma Davis", 
    age: 28, 
    lastVisit: "2024-03-05",
    email: "emma.d@email.com",
    phone: "(555) 345-6789",
    insurance: "UnitedHealth",
    balance: 75.50
  },
];

const analytics = {
  totalPatients: 156,
  todayAppointments: 12,
  pendingPayments: 8,
  monthlyRevenue: 24500
};

// Analytics Data
const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM dd'),
  revenue: Math.floor(Math.random() * 5000) + 1000,
  appointments: Math.floor(Math.random() * 20) + 5,
}));

const insuranceDistribution = [
  { name: 'BlueCross', value: 45 },
  { name: 'Aetna', value: 30 },
  { name: 'UnitedHealth', value: 25 },
  { name: 'Medicare', value: 20 },
  { name: 'Other', value: 10 },
];

const appointmentAnalytics = [
  { month: 'Jan', checkups: 45, followups: 30, consultations: 25 },
  { month: 'Feb', checkups: 50, followups: 35, consultations: 28 },
  { month: 'Mar', checkups: 40, followups: 38, consultations: 22 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(''); // To hold success message or status update
  const [invertory, setInventory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newItemName, setNewItemName] = useState('');  
  const [doctorTypes, setTypeOfDoctor] = useState([]);
  const [appointmentTypes, setTypeOfAppointment] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [patients, setPatients] = useState([]);

  const [newStock, setNewStock] = useState({
    quantity: '',
    cost: '',
    itemname: '',
  });
  const [analytics, setAnalytics] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPayments: 0,
    monthlyRevenue: 0
  });
  
  {/* Applications */}
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/employees`, {
          params: roleFilter !== 'all' ? { role: roleFilter } : {}
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };
    fetchEmployees();
  }, [roleFilter]);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/employees`, {
          params: roleFilter !== 'all' ? { role: roleFilter } : {}
        });
        setEmployees(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // const fetchApplications = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/users/getApplication`);
    //     setApplications(response.data);
    //   } catch (err) {
    //     console.error("Error fetching applications:", err);
    //   }
    // };
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/applications`);
        setApplications(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApplications();
  }, []);

  
  const handleAccept = async (application) => {
    const { email, stafftype } = application;
    console.log("Email:", email, "Stafftype:", stafftype);
  
    if (!email || !stafftype) {
      setError('Some application fields are missing.');
      return;
    }
  
    setError('');
    setSubmitting(true);

    const acceptedData = {
      email: email,
      status: 'accepted'
    };

    try {
      // Update application status to 'accepted'
      console.log(acceptedData);
      const statusResponseAccepted = await axios.post(`${apiUrl}/users/updateApplicationStatus`, acceptedData);
      console.log("Application status update response:", statusResponseAccepted);

      {/*Where to add in other staff*/}
      if (stafftype === 'receptionist') {
        await axios.post(`${apiUrl}/receptionist/syncreceptionists`, { email });
      }

      // Ensure only the correct application is moved
      setApplications((prev) =>
      prev.map((app) =>
        app.email === application.email && app.status === "pending" ? { ...app, status: "accepted" } : app
      )
    );
    
      setStatus(`User for ${email} created successfully.`);
    } catch (error) {
      console.error('Error over here:', error.response || error);
      setError('Failed to accept application.');
    }finally {
      setSubmitting(false);  // <-- Ensures the button re-enables
    }
    
  };

  const handleDeclined = async (application) => {
    const { email, stafftype } = application;
    console.log("Email:", email, "Stafftype:", stafftype);
  
    if (!email || !stafftype) {
      setError('Some application fields are missing.');
      return;
    }
    setError('');
    setSubmitting(true);

    const declineData = {
      email: email,
      status: 'rejected'
    };

    try{

        //Update application status to 'rejected'
        console.log(declineData);
        const statusResponseDeclined = await axios.post(`${apiUrl}/users/updateApplicationStatus`, declineData);
        console.log("Application status update response:", statusResponseDeclined);
        // Proceed with the UI update
        setApplications(prev =>
          prev.map(app =>
            app.email === application.email ? { ...app, status: 'rejected' } : app
          )
        );
                  
    } catch (error) {
      console.error('Error over here:', error.response || error);
      setError('Failed to reject application.');
    }finally {
      setSubmitting(false);  // <-- Ensures the button re-enables
    }
    
  };



  {/*Billing*/}

  {/*Fetching*/}
  //Invertory
  useEffect(() => {
    const fetchInventorys = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getInventory`);
        console.log('All of Invertory:', response.data);  
        setInventory(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventorys();
  }, []);
  
  //Materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getMaterials`);
        console.log('All of Material:',response.data);  
        setMaterials(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  //Type of Doctor (TypeOfDoctor)
  useEffect(() => {
    const fetchTypeOfDoctor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getdoctortypes`);
        console.log('All of types of doctors:', response.data);  
        setTypeOfDoctor(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTypeOfDoctor();
  }, []);

  //Type of Appointment (TypeOfAppointment)
  useEffect(() => {
    const fetchTypeOfAppointment = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getappointmenttypes`);
        console.log('All types of appoinments', response.data);  
        setTypeOfAppointment(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTypeOfAppointment();
  }, []);

  

  {/*Editing*/}

  const handleEditMaterialCost = async (id, newCost) => {
    try {
      const response = await axios.post(`${apiUrl}/inventory/editMaterials`, {
        inventoryid: id,
        cost: Number(newCost),
      });
      console.log("Edit of Material Cost", id , 'and', newCost);

      if (response.status === 200) {
        setMaterials(prev =>
          prev.map(material =>
            material.inventoryid === id
              ? { ...material, cost: Number(newCost) }
              : material
          )
        );
        setEditingId(null);  // Clear editing state
        setNewCost(''); // Reset new cost after update
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Failed to update cost:", err);
    }
  };

  const handleEditAppointments = async (id, newName, newCost) => {
    console.log("Edit of Appointment: Id:", id, 'Name:', newName, 'Cost:', newCost);
  
    try {
      const response = await axios.post(`${apiUrl}/inventory/editappointmenttypes`, {
        inventoryid: id,   // Send inventoryid in the body
        itemname: newName,  // Send the updated name
        cost: Number(newCost), // Send the updated cost
      });
  
      console.log("Edit of Appointment Type -  Id:", id, 'Name:', newName, 'Cost:', newCost);
  
      if (response.status === 200) {
        // Update state to reflect the change
        setTypeOfAppointment(prev =>
          prev.map(appointment =>
            appointment.inventoryid === id
              ? { ...appointment, itemname: newName, cost: Number(newCost) }
              : appointment
          )
        );
        setEditingId(null);  // Clear editing state
        setNewCost('');      // Reset new cost after update
        setNewName('');      // Reset new name after update
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Failed to update appointment type:", err);
    }
  };

  const handleEditDoctorType  = async (id, newName, newCost) => {
    console.log("Edit of Doctor: Id:", id, 'Name:', newName, 'Cost:', newCost);
  
    try {
      const response = await axios.post(`${apiUrl}/inventory/editdoctortypes`, {
        inventoryid: id,   // Send inventoryid in the body
        itemname: newName,  // Send the updated name
        cost: Number(newCost), // Send the updated cost
      });
  
      console.log("Edit of Appointment Type -  Id:", id, 'Name:', newName, 'Cost:', newCost);
  
      if (response.status === 200) {
        // Update state to reflect the change
        setTypeOfAppointment(prev =>
          prev.map(appointment =>
            appointment.inventoryid === id
              ? { ...appointment, itemname: newName, cost: Number(newCost) }
              : appointment
          )
        );
        setEditingId(null);  // Clear editing state
        setNewCost('');      // Reset new cost after update
        setNewName('');      // Reset new name after update
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Failed to update appointment type:", err);
    }
  };
  
  const getStockStatusColor = (stock, minStock) => {
    console.log('Stock:',stock,'Minimum Stock:', minStock);
    if (stock < minStock * 0.5) return 'text-yellow-600 bg-red-100';
    console.log('Calculation:', minStock * 2);
    if (stock < minStock) return 'text-red-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  
  
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold">{analytics.totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Appointments</p>
              <p className="text-2xl font-bold">{analytics.todayAppointments}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">{analytics.pendingPayments}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold">${analytics.monthlyRevenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Appointments and Patients Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Today's Appointments</h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {appointments.map(apt => (
              <div key={apt.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{apt.patient}</p>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <span>{apt.time}</span>
                    <span>•</span>
                    <span>{apt.doctor}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Patients</h3>
            <button 
              onClick={() => setShowNewPatientModal(true)}
              className="flex items-center text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Patient
            </button>
          </div>
          <div className="space-y-4">
            {patients.map(patient => (
              <div key={patient.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <span>Age: {patient.age}</span>
                    <span>•</span>
                    <span>{patient.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className={`font-medium ${patient.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${patient.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


  const fetchFilteredEmployees = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/employees`, {
        params: {
          role: roleFilter !== 'all' ? roleFilter : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  };

  //Optionally fetch all on load
  useEffect(() => {
    fetchFilteredEmployees();
  }, []);

  useEffect(() => {
    fetchFilteredEmployees();
  }, [roleFilter, startDate, endDate]);

  const renderEmployees = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
          <select
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="doctor">Doctors</option>
            <option value="specialist">Specialists</option>
            <option value="receptionist">Receptionists</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          
        </div>
        <button 
          onClick={() => setShowNewPatientModal(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New Patient
        </button>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
          <select
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="doctor">Doctors</option>
            <option value="specialist">Specialists</option>
            <option value="receptionist">Receptionists</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated On</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.filter(emp =>
              emp.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((emp) => (
              <tr key={emp.userid}>
                <td className="px-6 py-4 whitespace-nowrap">{emp.userid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{emp.role}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{emp.updatedAt ? new Date(emp.updatedAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
              <div className="p-2 relative">
                <div className="flex justify-end">
                  <NotificationBell />
                </div>
              </div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            <Plus className="h-5 w-5 mr-2" />
            New Appointment
          </button>
        </div>
        <div className="space-y-4">
          {appointments.map(apt => (
            <div key={apt.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{apt.patient}</p>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <span>{apt.time}</span>
                    <span>•</span>
                    <span>{apt.type}</span>
                    <span>•</span>
                    <span>{apt.doctor}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {apt.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <select 
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={analyticsView}
              onChange={(e) => setAnalyticsView(e.target.value)}
            >
              <option value="revenue">Revenue Analysis</option>
              <option value="appointments">Appointment Trends</option>
              <option value="insurance">Insurance Distribution</option>
            </select>
            <select 
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>

        {/* Charts */}
        <div className="mt-6">
          {analyticsView === 'revenue' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Revenue & Appointments Overview</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      name="Revenue ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="appointments"
                      stroke="#16a34a"
                      name="Appointments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {analyticsView === 'appointments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Appointment Type Distribution</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="checkups" fill="#2563eb" name="Check-ups" />
                    <Bar dataKey="followups" fill="#16a34a" name="Follow-ups" />
                    <Bar dataKey="consultations" fill="#9333ea" name="Consultations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {analyticsView === 'insurance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Insurance Provider Distribution</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insuranceDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2563eb" name="Patients" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Detailed Analytics</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Patients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Claims</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.slice(-7).map((day, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.appointments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.floor(Math.random() * 5)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.floor(Math.random() * 10) + 5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => {
    if (!applications || applications.length === 0) {
      return <p className="text-center text-gray-500">No applications available.</p>;
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Categories */}
        {["pending", "accepted", "rejected"].map((status) => {
          const statusMap = {
            pending: { title: "Pending Applications", color: "text-yellow-600" },
            accepted: { title: "Approved Applications", color: "text-green-600" },
            rejected: { title: "Rejected Applications", color: "text-red-600" },
          };
  
          const filteredApps = applications.filter((app) => app.status === status);
  
          return (
            <div
              key={status}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <h3 className={`text-xl font-semibold ${statusMap[status].color} mb-5`}>
                {statusMap[status].title}
              </h3>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredApps.length === 0 ? (
                    <motion.p
                      key={`no-${status}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-gray-500 italic"
                    >
                      No {status} applications.
                    </motion.p>
                  ) : (
                    filteredApps.map((app) => (
                      <motion.div
                        key={app.email} // Fixed duplicate key issue
                        layoutId={app.email} // Unique layoutId for animation
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm transition-colors"
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {app.firstName} {app.lastName}
                            </p>
                            <p className="text-sm text-gray-700">{app.email}</p>
                            <p className="text-sm text-gray-700">{app.stafftype}</p>
                            <p className="text-sm text-gray-800 mt-2">
                              <span className="font-medium">Experience:</span> {app.experience} years
                            </p>
                            <p className="text-xs italic text-gray-500 mt-1">
                              Qualification: {app.qualifications}
                            </p>
                          </div>
                          <div className="flex flex-col justify-between text-right">
                            <div>
                              <p className="text-sm font-semibold text-gray-500">{app.status}</p>
                              <p className="text-sm text-gray-500">{app.city}, {app.state}</p>
                            </div>
                            {status === "pending" && (
                              <div className="mt-3 flex justify-end gap-3">
                                <button
                                  className="text-green-600 hover:text-green-800"
                                  onClick={() => handleAccept(app)}
                                  disabled={submitting}
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-600 transition"
                                  onClick={() => handleDeclined(app)}
                                  disabled={submitting}
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
 
  const renderBilling = () => {
    return (
      <div className="space-y-8">

        {/* Appointment Types */}
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex items-center mb-4">
        <Calendar className="text-blue-500 mr-2" size={24} />
        <h2 className="text-xl font-semibold">Appointment Types</h2>
      </div>

      <Link
        to="/AddAppointmentTypes"
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 absolute top-4 right-4"
      >
        Add New Type of Appointment
      </Link>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 ">Appointment Type</th>
            <th className="pb-3 ">Cost ($)</th>
            <th className="pb-3 ">Actions</th>
          </tr>
        </thead>
          <tbody>
            {appointmentTypes.map((appointment) => (
              <tr key={appointment.inventoryid} className="border-b">
                {editingId === `appointment-${appointment.inventoryid}` ? (
                  <>
                    <td className="py-4">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="number"
                        value={newCost}
                        onChange={(e) => setNewCost(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          handleEditAppointments(appointment.inventoryid, newName, newCost)
                        }
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewName('');
                          setNewCost('');
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4">{appointment.itemname}</td>
                    <td className="py-4 ">{appointment.cost}</td>
                    <td className="py-4 ">
                      <button
                        onClick={() => {
                          setEditingId(`appointment-${appointment.inventoryid}`);
                          setNewName(appointment.itemname);
                          setNewCost(appointment.cost);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>   

        {/* Doctor Types */}
<div className="bg-white rounded-lg shadow-sm p-6 relative">
  <div className="flex items-center mb-4">
    <Stethoscope className="text-green-500 mr-2" size={24} />
    <h2 className="text-xl font-semibold">Doctor Types</h2>
  </div>

    <Link
      to="/AddDoctorTypes"
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 absolute top-4 right-4"
    >
      Add New Doctor Type
    </Link>

  <table className="w-full">
    <thead>
      <tr className="text-left text-gray-500 border-b">
        <th className="pb-3">Doctor Type</th>
        <th className="pb-3">Base Rate ($)</th>
        <th className="pb-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {doctorTypes.map((doctor) => (
        <tr key={doctor.inventoryid} className="border-b">
          {editingId === `doctor-${doctor.inventoryid}` ? (
            <>
              <td className="py-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </td>
              <td className="py-4">
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </td>
              <td className="py-4 text-right space-x-2">
                <button
                  onClick={() =>
                    handleEditDoctorType(doctor.inventoryid, newName, newCost)
                  }
                  className="text-green-600 hover:text-green-800"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNewName('');
                    setNewCost('');
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={18} />
                </button>
              </td>
            </>
          ) : (
            <>
              <td className="py-4">{doctor.itemname}</td>
              <td className="py-4">${doctor.cost}</td>
              <td className="py-4 ">
                <button
                  onClick={() => {
                    setEditingId(`doctor-${doctor.inventoryid}`);
                    setNewName(doctor.itemname);
                    setNewCost(doctor.cost);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
              </td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  
         {/* Materials */}
         <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Pill className="text-purple-500 mr-2" size={24} />
              <h2 className="text-xl font-semibold">Medical Materials</h2>
            </div>
            <Link
              to="/AddStockModal"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-block"
            >
              Add New Stock
            </Link>
          </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Item</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Min. Stock</th>
                <th className="pb-3">Last Restocked</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Price ($)</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.inventoryid} className="border-b">
                  <td className="py-4">{material.itemname}</td>
                  <td className="py-4">{material.quantity}</td>
                  <td className="py-4">{material.materialStockMin}</td>
                  <td className="py-4">{material.date}</td>
                  <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStockStatusColor(
                      material.quantity,
                      material.materialStockMin
                    )}`}
                  >
                    {material.quantity < material.materialStockMin * 0.5 ? (
                      <div className="flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        Low Stock
                      </div>
                    ) : material.quantity < material.materialStockMin ? (
                      'Reorder Soon'
                    ) : (
                      'Normal'
                    )}
                  </span>
                  </td>
                  <td className="py-4">
                    {editingId === `material-${material.inventoryid}` ? (
                      <input
                        type="number"
                        value={newCost || material.cost} // Bind input value to state
                        className="border rounded px-2 py-1 w-24"
                        onChange={e => setNewCost(e.target.value)} // Update state on change
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleEditMaterialCost(material.inventoryid, newCost);
                          }
                        }}
                      />
                    ) : (
                      `$${material.cost}`
                    )}
                  </td>
                  <td className="py-4">
                    {editingId === `material-${material.inventoryid}` ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMaterialCost(material.inventoryid, newCost)} // Use state value
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setNewCost(''); // Reset new cost when canceling
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(`material-${material.inventoryid}`);
                          setNewCost(material.cost); // Set the initial cost when editing
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'employees':
        return renderEmployees();
      case 'applications':
        return renderApplications();
      case 'appointments':
        return renderAppointments();
      case 'analytics':
        return renderAnalytics();
      case 'billing':
        return renderBilling();  
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F8F9FA] m-0 p-0 shadow rounded-lg w-full mt-0">
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-0x0 mx-auto px-1 sm:px-0 lg:px-0 py-0">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex space-x-4 mb-8">
              {[
                ['dashboard', 'Dashboard', <Activity className="h-5 w-5 mr-2" />],
                ['applications', 'Applications', <FileText className="h-5 w-5 mr-2" />],
                ['employees', 'Employee', <Users className="h-5 w-5 mr-2" />],
                ['appointments', 'Appointments', <Calendar className="h-5 w-5 mr-2" />],
                ['analytics', 'Analytics', <BarChart2 className="h-5 w-5 mr-2" />],
                ['billing', 'Billing', <DollarSign className="h-5 w-5 mr-2" />],
              ].map(([tabKey, label, icon]) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    activeTab === tabKey ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
  
            {renderContent()}
          </div>
  
          {/* New Patient Modal */}
          {showNewPatientModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNewPatientModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Add Patient
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 