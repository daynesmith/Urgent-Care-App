import { useState } from "react";
import { format } from "date-fns";

export default function ReceptionistBillingPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [bill, setBill] = useState([]);

    useEffect(() => {
    const fetchBillingItems = async () => {
        try {
            const response = await axios.get(`${apiUrl}/inventory/getappointmenttypes`);
            setTypeOfAppointment(response.data);
        } catch (err) {
            setError('Failed to fetch appointment types.');
        } finally {
            setLoading(false);
        }
    };
    fetchBillingItems();
}, []);
  

  const calculateSubtotal = () => {
    const materialCost = bill.materialItems.reduce((sum, item) => sum + item.cost, 0);
    return bill.appointmentCost + materialCost + bill.additionalFees;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - bill.discount - bill.insuranceCoverage;
  };

  const handleMaterialCostChange = (id, newCost) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.map((item) => 
        item.id === id ? { ...item, cost: newCost } : item
      ),
    });
  };

  const handleMaterialNameChange = (id, newName) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.map((item) => 
        item.id === id ? { ...item, name: newName } : item
      ),
    });
  };

  const getPriceByAppointmentAndDoctorType = (appointmentType, doctorType) => {
    if (appointmentType === "consultation") {
      return doctorType === "specialist" ? 250 : 150;
    } else if (appointmentType === "follow-up") {
      return doctorType === "specialist" ? 200 : 100;
    } else if (appointmentType === "procedure") {
      return doctorType === "specialist" ? 500 : 300;
    }
    return 0;
  };

  const handleAppointmentTypeChange = (value) => {
    const newCost = getPriceByAppointmentAndDoctorType(value, bill.doctorType);
    setBill({
      ...bill,
      appointmentType: value,
      appointmentCost: newCost,
    });
  };

  const handleDoctorTypeChange = (value) => {
    const newCost = getPriceByAppointmentAndDoctorType(bill.appointmentType, value);
    setBill({
      ...bill,
      doctorType: value,
      appointmentCost: newCost,
    });
  };

  const handleAddMaterialItem = () => {
    const newId = Math.max(0, ...bill.materialItems.map((item) => item.id)) + 1;
    setBill({
      ...bill,
      materialItems: [...bill.materialItems, { id: newId, name: "New Item", cost: 0 }],
    });
  };

  const handleRemoveMaterialItem = (id) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.filter((item) => item.id !== id),
    });
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    alert("Changes saved successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Bill Review</h1>
          <p className="text-gray-600">Review and edit patient billing information</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={handlePrint}
            className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
          >
            Print
          </button>
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              Edit Bill
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Patient Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Patient Information</h2>
            <p className="text-gray-600 text-sm">Patient and appointment details</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={bill.patientName}
                  onChange={(e) => setBill({ ...bill, patientName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={bill.patientId}
                  onChange={(e) => setBill({ ...bill, patientId: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={format(bill.appointmentDate, "yyyy-MM-dd")}
                  onChange={(e) => setBill({ ...bill, appointmentDate: new Date(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={bill.doctorName}
                  onChange={(e) => setBill({ ...bill, doctorName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Type
                </label>
                <select
                  value={bill.doctorType}
                  onChange={(e) => handleDoctorTypeChange(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                >
                  <option value="specialist">Specialist</option>
                  <option value="general">General Practitioner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select
                  value={bill.appointmentType}
                  onChange={(e) => handleAppointmentTypeChange(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="procedure">Procedure</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Billing Summary</h2>
            <p className="text-gray-600 text-sm">Cost breakdown and totals</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Appointment Cost:</span>
              <div className="flex items-center">
                {isEditing ? (
                  <input
                    type="number"
                    value={bill.appointmentCost}
                    onChange={(e) => setBill({ ...bill, appointmentCost: Number(e.target.value) })}
                    className="w-24 px-3 py-2 border rounded-md text-right"
                  />
                ) : (
                  <span>${bill.appointmentCost.toFixed(2)}</span>
                )}
                {bill.doctorType === "specialist" && (
                  <span className="ml-2 text-xs border rounded px-2 py-1">
                    Specialist Rate
                  </span>
                )}
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <div className="flex justify-between items-center mb-2">
                <span>Materials & Medications:</span>
                {isEditing && (
                  <button
                    onClick={handleAddMaterialItem}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Add Item
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {bill.materialItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          value={item.name}
                          onChange={(e) => handleMaterialNameChange(item.id, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => handleMaterialCostChange(item.id, Number(e.target.value))}
                          className="w-24 px-3 py-2 border rounded-md"
                        />
                        <button
                          onClick={() => handleRemoveMaterialItem(item.id)}
                          className="px-3 py-2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{item.name}</span>
                        <span className="w-24 text-right">${item.cost.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center">
              <span>Additional Fees:</span>
              {isEditing ? (
                <input
                  type="number"
                  value={bill.additionalFees}
                  onChange={(e) => setBill({ ...bill, additionalFees: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border rounded-md text-right"
                />
              ) : (
                <span>${bill.additionalFees.toFixed(2)}</span>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center font-medium">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Discount:</span>
              {isEditing ? (
                <input
                  type="number"
                  value={bill.discount}
                  onChange={(e) => setBill({ ...bill, discount: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border rounded-md text-right"
                />
              ) : (
                <span>-${bill.discount.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span>Insurance Coverage:</span>
              {isEditing ? (
                <input
                  type="number"
                  value={bill.insuranceCoverage}
                  onChange={(e) => setBill({ ...bill, insuranceCoverage: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border rounded-md text-right"
                />
              ) : (
                <span>-${bill.insuranceCoverage.toFixed(2)}</span>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Due:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="approved"
                checked={!isEditing}
                onChange={(e) => setIsEditing(!e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="approved" className="text-sm">
                Bill Approved
              </label>
            </div>
            <button
              disabled={isEditing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalize Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}