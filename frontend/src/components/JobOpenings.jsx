import React, { useState } from 'react';
import { BriefcaseIcon, MapPinIcon } from 'lucide-react'; // Assuming you're using lucide-react icons
import ApplicationForm from './ApplicationForm.jsx';

const jobOpenings = [
  {
    id: 1,
    title: 'Primary Care Physician',
    department: 'Medical',
    jobtype: 'doctor',
    location: 'Main Clinic',
    type: 'Full-time',
    description: 'Seeking an experienced Primary Care Physician to join our growing medical practice.',
    requirements: [
      'MD or DO degree from an accredited institution',
      'Current state medical license',
      'Board certification in Internal Medicine or Family Medicine',
      '3+ years of clinical experience',
    ]
  },
  {
    id: 2,
    title: 'Medical Receptionist',
    department: 'Administrative',
    location: 'Main Clinic',
    jobtype: 'receptionist',
    type: 'Full-time',
    description: 'Looking for a friendly and organized Medical Receptionist to manage front desk operations.',
    requirements: [
      'High school diploma or equivalent',
      'Previous medical office experience preferred',
      'Strong communication and organizational skills',
      'Proficiency in EMR systems',
    ]
  },
  {
    id: 3,
    title: 'Clinic Administrator',
    department: 'Administrative',
    location: 'Main Clinic',
    jobtype: 'admin',
    type: 'Full-time',
    description: 'Seeking an experienced Clinic Administrator to oversee daily operations.',
    requirements: [
      "Bachelor's degree in Healthcare Administration or related field",
      '5+ years of healthcare management experience',
      'Strong leadership and problem-solving skills',
      'Experience with healthcare regulations and compliance',
    ]
  },
  {
    id: 4,
    title: 'Medical Specialist',
    department: 'Medical',
    jobtype: 'specialist',
    location: 'Specialty Clinic',
    type: 'Full-time',
    description: 'Seeking an experienced Specialist to join our growing medical team.',
    board: {
      name: 'Board of Certification',
      certificationRequired: true,
      boardCertificationLink: '[Link to board certification website]',
    },
    requirements: [
      'Relevant specialty qualifications',
      'Board certification in the relevant specialty',
      '5+ years of experience in the field',
      'Strong clinical and diagnostic skills',
    ]
  },
  {
    id: 5,
    title: 'Registered Nurse',
    department: 'Nursing',
    jobtype: 'nurse',
    location: 'General Ward',
    type: 'Full-time',
    description: 'Compassionate and dedicated RN needed to provide high-quality patient care in a fast-paced hospital environment.',
    board: {
      name: 'State Board of Nursing',
      certificationRequired: true,
      boardCertificationLink: '[Link to state nursing board website]',
    },
    requirements: [
      'Active RN license',
      'BSN preferred',
      'Minimum 2 years of clinical experience',
      'Excellent communication and critical thinking skills',
    ]
  },  
];

function JobOpenings() {
  const [selectedJob, setSelectedJob] = useState(null); 
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleApply = (jobId) => {
    setSelectedJob(jobId);
    setShowApplicationForm(true);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Current Openings</h2>
      <div className="grid grid-cols-1 gap-6">
        {jobOpenings.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    {job.department} • {job.type}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {job.location}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleApply(job.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
            <p className="mt-4 text-gray-600">{job.description}</p>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900">Requirements:</h4>
              <ul className="mt-2 list-disc list-inside text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showApplicationForm && selectedJob && (
        <ApplicationForm
          job={jobOpenings.find(job => job.id === selectedJob)}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </div>
  );
}

export default JobOpenings;
