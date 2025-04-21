

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// const apiUrl = import.meta.env.VITE_API_URL;

// export default function RevenueReport() {
//   const [patientId, setPatientId] = useState('');
//   const [bills, setBills] = useState([]);

//   useEffect(() => {
//     const fetchRevenue = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");

//         const { data } = await axios.get(`${apiUrl}/receptionist/revenue-report`, {
//           params: { patientid: patientId },
//           headers: {
//             'accessToken': token
//           }
//         });

//         setBills(data.bills || []);
//       } catch (error) {
//         console.error('Error fetching revenue data:', error);
//       }
//     };

//     fetchRevenue();
//   }, [patientId]);

//   const totalRevenue = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-lg font-medium text-gray-900 mb-4">Total Revenue Report</h2>

//       <div className="mb-4">
//         <label className="block text-gray-700">Filter by Patient ID</label>
//         <input
//           type="text"
//           value={patientId}
//           onChange={(e) => setPatientId(e.target.value)}
//           placeholder="Enter Patient ID"
//           className="mt-1 p-2 border border-gray-300 rounded-md w-full"
//         />
//       </div>

//       <div className="mb-4">
//         <h3 className="text-lg font-medium text-gray-900">Total Paid Revenue:</h3>
//         <p className="text-xl font-semibold text-green-600">${totalRevenue.toFixed(2)}</p>
//       </div>

//       <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">Billing Records:</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-3 py-2">Billing ID</th>
//                 <th className="border px-3 py-2">Amount</th>
//                 <th className="border px-3 py-2">Date</th>
//                 <th className="border px-3 py-2">Status</th>
//                 <th className="border px-3 py-2">Patient</th>
//                 <th className="border px-3 py-2">Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bills.map((bill) => (
//                 <tr key={bill.billingid}>
//                   <td className="border px-3 py-2">{bill.billingid}</td>
//                   <td className="border px-3 py-2">${parseFloat(bill.amount).toFixed(2)}</td>
//                   <td className="border px-3 py-2">{new Date(bill.billingDate).toLocaleDateString()}</td>
//                   <td className="border px-3 py-2">{bill.status}</td>
//                   <td className="border px-3 py-2">{bill.firstname} {bill.lastname}</td>
//                   <td className="border px-3 py-2">{bill.email}</td>
//                 </tr>
//               ))}
//               {bills.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4 text-gray-500">
//                     No records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export default function RevenueReport() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const { data } = await axios.get(`${apiUrl}/receptionist/revenue-report`, {
          params: { firstname, lastname },
          headers: {
            'accessToken': token
          }
        });

        setBills(data.bills || []);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenue();
  }, [firstname, lastname]);

  const totalRevenue = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Total Revenue Report</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Filter by First Name</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Enter First Name"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700">Filter by Last Name</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Enter Last Name"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Total Paid Revenue:</h3>
        <p className="text-xl font-semibold text-green-600">${totalRevenue.toFixed(2)}</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Billing Records:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Billing ID</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Patient</th>
                <th className="border px-3 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.billingid}>
                  <td className="border px-3 py-2">{bill.billingid}</td>
                  <td className="border px-3 py-2">${parseFloat(bill.amount).toFixed(2)}</td>
                  <td className="border px-3 py-2">{new Date(bill.billingDate).toLocaleDateString()}</td>
                  <td className="border px-3 py-2">{bill.status}</td>
                  <td className="border px-3 py-2">{bill.firstname} {bill.lastname}</td>
                  <td className="border px-3 py-2">{bill.email}</td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
