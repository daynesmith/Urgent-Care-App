import React from 'react';
import { BriefcaseIcon, Stethoscope, UserCircle, Users } from 'lucide-react';
import JobOpenings from '../components/JobOpenings.jsx';

export default function JoinTheTeam() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BriefcaseIcon className="h-8 w-8 text-blue-600" />
            Join Our Medical Team
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Make a Difference in Healthcare</h2>
          <p className="text-gray-600 mb-6">
            Join our dedicated team of healthcare professionals and contribute to providing exceptional patient care.
            We offer competitive benefits, professional growth opportunities, and a supportive work environment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-600" />
              <span className="text-blue-900">Medical Professionals</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <UserCircle className="h-6 w-6 text-blue-600" />
              <span className="text-blue-900">Administrative Staff</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-blue-900">Support Teams</span>
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <JobOpenings />
      </main>
    </div>
  );
}
