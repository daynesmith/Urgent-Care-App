import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users, Calendar, FileText, Settings, Bell, Plus, Search, ChevronDown,
  Activity, DollarSign, UserPlus, Clock, BarChart2, Filter, Download, CheckCircle, XCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
/*
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
*/

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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Medical Clinic Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 relative">
                <Bell className="h-6 w-6 text-gray-500" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="p-2">
                <Settings className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>
            <Activity className="h-5 w-5 mr-2" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('applications')} className={`flex items-center px-4 py-2 rounded-lg ${activeTab === 'applications' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>
            <FileText className="h-5 w-5 mr-2" /> Applications
          </button>
          <button onClick={() => setActiveTab('employees')} className={`flex items-center px-4 py-2 rounded-lg ${activeTab === 'employees' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>
            <Users className="h-5 w-5 mr-2" /> Employees
          </button>
        </div>

        {activeTab === 'employees' && renderEmployees()}
      </div>
    </div>
  );
}
