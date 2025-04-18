import React from 'react';
import StaffShiftTable from '../components/StaffShiftTable'; // Import the table component
import StaffShiftCalendar from '../components/StaffShiftCalendar';

const StaffViewShifts = () => {
    return (
        <div>
            <div style={{ padding: '20px' }}>
                <StaffShiftCalendar />
            </div>
            <div style={{ padding: '20px' }}>
                <StaffShiftTable />
            </div>
        </div>
    );
};

export default StaffViewShifts;