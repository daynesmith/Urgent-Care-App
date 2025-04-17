import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function DoctorAppointmentsReport() {
  const [doctorStats, setDoctorStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = () => {
    setLoading(true);
    let query = "";
    if (startDate && endDate) {
      query = `?start=${startDate}&end=${endDate}`;
    }
    fetch(`${apiUrl}/api/reports/doctor-appointments${query}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctorStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctor appointments report:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Doctor Appointments Report</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 min-w-[160px] shadow-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 min-w-[160px] shadow-sm"
          />
        </div>
        <button
          onClick={fetchReport}
          className="self-end bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      ) : doctorStats.length === 0 ? (
        <p className="text-center text-gray-600">No doctors or appointments found for the selected dates.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctorStats.map((doc) => (
            <div key={doc.doctorid} className="p-5 flex justify-between items-center border rounded-2xl shadow-sm hover:shadow-md transition">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{doc.doctor_name}</h2>
                <p className="text-sm text-gray-500">Doctor ID: {doc.doctorid}</p>
              </div>
              <div className="text-lg font-bold text-blue-600 text-right">
                {doc.total_appointments} {doc.total_appointments === 1 ? "appointment" : "appointments"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
