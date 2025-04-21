import React from 'react';
import {useState, useEffect} from 'react';
import SpecialistDropDown from '../components/SpecialistDropDown';
import axios from 'axios';

const SpecialistTests = () => {
    const [selectedSpecialist, setSelectedSpecialist] = useState('');
  
    return (
      <div>
        <h1>Specialist Test Page</h1>
        <p>This is the Specialist Test page. Use the dropdown below to select a specialist.</p>
  
        <div>
          <label htmlFor="specialist" className="block text-sm font-medium text-gray-700">
            Choose a Specialist:
          </label>
          <SpecialistDropDown
            selected={selectedSpecialist}
            setSelected={setSelectedSpecialist}
          />
        </div>
  
        <div className="mt-4">
          <p className="text-sm font-medium">Selected Specialist:</p>
          <p className="text-lg font-bold">{selectedSpecialist || 'None selected'}</p>
        </div>
      </div>
    );
  };
  
  export default SpecialistTests;