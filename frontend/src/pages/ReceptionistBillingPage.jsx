"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useParams } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Printer, Edit, Save, Plus, Trash2, AlertCircle, Loader2, CheckCircle } from "lucide-react"

// Fix for the VITE_API_URL error - provide a fallback
const apiUrl = import.meta.env.VITE_API_URL

export default function ReceptionistBillingPage() {
  const { id } = useParams() // Extract the appointment ID correctly from params
  console.log("The appointment id:", id) // Log the `id` correctly

  // State declarations
  const [isEditing, setIsEditing] = useState(false)
  const [appointmentIds, setAppointmentIds] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [appointments, setAppointments] = useState([])
  const [suppliesByAppointment, setSuppliesByAppointment] = useState({})
  const [inventory, setInventory] = useState({})
  const [costByAppointment, setCostByAppointment] = useState({})
  const [appointmentTypes, setAppointmentTypes] = useState([])
  const [currentAppointment, setCurrentAppointment] = useState(null)

  // Update the bill state to separate appointment type fee and doctor type fee
  const [bill, setBill] = useState({
    patientName: "",
    patientId: "",
    appointmentDate: new Date(),
    doctorName: "",
    doctorType: "",
    doctorTypeFee: 0,
    appointmentType: "",
    appointmentTypeFee: 0,
    materialItems: [],
    additionalFees: 0,
    discount: 0,
    insuranceCoverage: 0,
    notes: "",
    status: "",
  })

  //Billing status

  // Helper function to group arrays by a key
  const groupBy = (array, key) => {
    if (!array || !Array.isArray(array)) return {}

    return array.reduce((result, item) => {
      const keyValue = item[key]
      if (keyValue) {
        ;(result[keyValue] = result[keyValue] || []).push(item)
      }
      return result
    }, {})
  }

  // Fetch appointment types
  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getappointmenttypes`)
        if (response.data && Array.isArray(response.data)) {
          setAppointmentTypes(response.data)
        } else {
          console.error("Invalid appointment types data format:", response.data)
        }
      } catch (err) {
        console.error("Failed to fetch appointment types:", err)
        setError("Failed to fetch appointment types: " + (err.message || "Unknown error"))
      }
    }

    fetchAppointmentTypes()
  }, [])
  console.log(appointments)

  // Get the appointmentid one only
  useEffect(() => {
    const fetchAppointmentsAndTypes = async () => {
      try {
        setLoading(true)
        console.log("🔄 Fetching appointments and appointment types...")

        // Fetch appointments
        const appointmentsResponse = await axios.get(`${apiUrl}/appointments/getappointments`)
        console.log("📥 Raw appointments response:", appointmentsResponse.data)

        if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
          const completedAppointments = appointmentsResponse.data
            .filter((appointment) => appointment.appointmentstatus === "completed")
            .map((appointment) => ({
              ...appointment,
              patientName: appointment.patient
                ? `${appointment.patient.firstname || ""} ${appointment.patient.lastname || ""}`
                : "Unknown Patient",
            }))

          setAppointments(completedAppointments)
          console.log("✅ Completed appointments:", completedAppointments)

          // Match the specific appointment by ID
          if (id) {
            // Check if `id` exists
            const found = completedAppointments.find((apt) => apt.appointmentid === Number(id))

            console.log("🔍 Appointment ID to find:", id) // Log the correct `id`
            console.log("📌 Found appointment:", found)

            if (found) {
              setCurrentAppointment(found)

              // Initialize bill with appointment data
              setBill({
                ...bill,
                patientName: found.patientName || "",
                patientId: found.patientid || "",
                appointmentDate: found.requesteddate ? new Date(found.requesteddate) : new Date(),
                doctorName: found.doctor ? `Dr. ${found.doctor.firstname || ""} ${found.doctor.lastname || ""}` : "",
                doctorType: found.specialistid ? "specialist" : "general",
                appointmentType: found.appointmenttype || "consultation",
                appointmentTypeFee: 0,
                doctorTypeFee: 0,
                materialItems: [],
                insuranceCoverage: 0,
              })
              console.log("🧾 Bill initialized:", {
                ...bill,
                patientName: found.patientName || "",
                patientId: found.patientid || "",
                appointmentDate: found.requesteddate ? new Date(found.requesteddate) : new Date(),
                doctorName: found.doctor ? `Dr. ${found.doctor.firstname || ""} ${found.doctor.lastname || ""}` : "",
                doctorType: found.specialistid ? "specialist" : "general",
                appointmentType: found.appointmenttype || "consultation",
                appointmentTypeFee: 0,
                doctorTypeFee: 0,
                materialItems: [],
                insuranceCoverage: 0,
              })
            } else {
              setError(`Appointment with ID ${id} not found.`) // Use `id` here
              console.warn("⚠️ Appointment not found for ID:", id) // Log the correct ID
            }
          }
        } else {
          console.error("❌ Invalid appointment data format:", appointmentsResponse.data)
          setError("Failed to load appointments: Invalid data format")
        }

        // Fetch appointment types
        const typesResponse = await axios.get(`${apiUrl}/inventory/getappointmenttypes`)
        console.log("📥 Raw appointment types response:", typesResponse.data)

        if (typesResponse.data && Array.isArray(typesResponse.data)) {
          setAppointmentTypes(typesResponse.data)
          console.log("✅ Appointment types:", typesResponse.data)
        } else {
          console.error("❌ Invalid appointment types data format:", typesResponse.data)
          setError("Failed to load appointment types: Invalid data format")
        }
      } catch (err) {
        console.error("🚨 Error fetching data:", err)
        setError("Error loading data: " + (err.message || "Unknown error"))
      } finally {
        setLoading(false)
        console.log("✅ Fetching done.")
      }
    }

    fetchAppointmentsAndTypes()
  }, [id]) // Depend on `id` to re-run when it changes

  // Fetch supplies
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const res = await axios.get(`${apiUrl}/visitinfo/getAllVisitSupplies`)

        if (res.data && res.data.visitSupplies && Array.isArray(res.data.visitSupplies)) {
          const grouped = groupBy(res.data.visitSupplies, "visitinfoid")
          setSuppliesByAppointment(grouped)

          // If we have the current appointment, populate material items
          if (currentAppointment && grouped[currentAppointment.appointmentid]) {
            const appointmentSupplies = grouped[currentAppointment.appointmentid]
            const materialItems = appointmentSupplies.map((supply, index) => ({
              id: index + 1,
              name: supply.inventory?.itemname || supply.name || "Unknown Item",
              cost: (supply.inventory?.cost || 0) * (supply.quantity || 1),
              quantity: supply.quantity || 1,
              unitCost: supply.inventory?.cost || 0,
            }))

            setBill((prev) => ({
              ...prev,
              materialItems,
            }))
          }
        } else {
          console.error("Invalid supplies data format:", res.data)
        }
      } catch (err) {
        console.error("Failed to fetch supplies:", err)
      }
    }

    if (currentAppointment) {
      fetchSupplies()
    }
  }, [currentAppointment])

  // Fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${apiUrl}/inventory/getInventory`)

        if (res.data && Array.isArray(res.data)) {
          const inventoryMap = res.data.reduce((acc, item) => {
            if (item && item.itemname) {
              acc[item.itemname] = item.cost || 0
            }
            return acc
          }, {})

          setInventory(inventoryMap)

          // Update appointment cost based on inventory data
          if (currentAppointment) {
            const { doctorid, specialistid, appointmenttype } = currentAppointment

            // Doctor type fee
            let doctorTypeFee = 0
            if (specialistid && specialistid !== "undefined") {
              doctorTypeFee = inventoryMap["Specialist Care"] || 0
            } else if (doctorid) {
              doctorTypeFee = inventoryMap["Primary Care"] || 0
            }

            // Appointment type fee
            let appointmentTypeFee = 0
            if (appointmenttype && inventoryMap[appointmenttype]) {
              appointmentTypeFee = inventoryMap[appointmenttype]
            } else if (appointmenttype === "consultation") {
              appointmentTypeFee = inventoryMap["Consultation"] || 0
            } else if (appointmenttype === "follow-up") {
              appointmentTypeFee = inventoryMap["Follow-up"] || 0
            } else if (appointmenttype === "procedure") {
              appointmentTypeFee = inventoryMap["Procedure"] || 0
            }

            setBill((prev) => ({
              ...prev,
              doctorTypeFee,
              appointmentTypeFee,
            }))
          }
        } else {
          console.error("Invalid inventory data format:", res.data)
        }
      } catch (err) {
        console.error("Failed to fetch inventory:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [currentAppointment])

  // Update the getPriceByAppointmentAndDoctorType function to return separate fees
  const getFeesForAppointmentAndDoctor = () => {
    // Doctor type fees
    let doctorTypeFee = 0
    if (bill.doctorType === "specialist") {
      doctorTypeFee = inventory["Specialist Care"] || 0
    } else {
      doctorTypeFee = inventory["Primary Care"] || 0
    }

    // Appointment type fees
    let appointmentTypeFee = 0
    if (bill.appointmentType === "consultation") {
      appointmentTypeFee = inventory["Consultation"] || 0
    } else if (bill.appointmentType === "follow-up") {
      appointmentTypeFee = inventory["Follow-up"] || 0
    } else if (bill.appointmentType === "procedure") {
      appointmentTypeFee = inventory["Procedure"] || 0
    } else if (inventory[bill.appointmentType]) {
      appointmentTypeFee = inventory[bill.appointmentType]
    }

    return { doctorTypeFee, appointmentTypeFee }
  }

  // Update the calculateSubtotal function to use the separate fees
  const calculateSubtotal = () => {
    const materialCost = bill.materialItems.reduce((sum, item) => sum + item.cost, 0)
    return bill.doctorTypeFee + bill.appointmentTypeFee + materialCost + bill.additionalFees
  }

  // Calculate total (subtotal - discount - insurance)
  const calculateTotal = () => {
    return calculateSubtotal() - bill.discount - bill.insuranceCoverage
  }

  // Handle material cost change
  const handleMaterialCostChange = (id, newCost) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.map((item) =>
        item.id === id ? { ...item, cost: Number.parseFloat(newCost) || 0 } : item,
      ),
    })
  }

  // Handle material name change
  const handleMaterialNameChange = (id, newName) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.map((item) => (item.id === id ? { ...item, name: newName } : item)),
    })
  }

  // Handle material quantity change
  const handleMaterialQuantityChange = (id, newQuantity) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.map((item) => {
        if (item.id === id) {
          const quantity = Number.parseInt(newQuantity) || 1
          return {
            ...item,
            quantity,
            cost: item.unitCost * quantity,
          }
        }
        return item
      }),
    })
  }

  // Update the handleAppointmentTypeChange function
  const handleAppointmentTypeChange = (value) => {
    setBill((prevBill) => {
      const newBill = { ...prevBill, appointmentType: value }
      const { appointmentTypeFee } = getFeesForAppointmentAndDoctor()
      return { ...newBill, appointmentTypeFee }
    })
  }

  // Update the handleDoctorTypeChange function
  const handleDoctorTypeChange = (value) => {
    setBill((prevBill) => {
      const newBill = { ...prevBill, doctorType: value }
      const { doctorTypeFee } = getFeesForAppointmentAndDoctor()
      return { ...newBill, doctorTypeFee }
    })
  }

  // Add new material item
  const handleAddMaterialItem = () => {
    const newId = bill.materialItems.length > 0 ? Math.max(...bill.materialItems.map((item) => item.id)) + 1 : 1

    setBill({
      ...bill,
      materialItems: [...bill.materialItems, { id: newId, name: "New Item", cost: 0, quantity: 1, unitCost: 0 }],
    })
  }

  // Remove material item
  const handleRemoveMaterialItem = (id) => {
    setBill({
      ...bill,
      materialItems: bill.materialItems.filter((item) => item.id !== id),
    })
  }

  // Handle numeric input changes
  const handleNumericChange = (field, value) => {
    const numericValue = Number.parseFloat(value) || 0
    setBill({
      ...bill,
      [field]: numericValue,
    })
  }

  // Save changes
  const handleSaveChanges = () => {
    setIsEditing(false)
    // In a real app, you would send the updated bill to the server here
    alert("Changes saved successfully")
  }

  // Print bill
  const handlePrint = () => {
    window.print()
  }

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A"
    try {
      return format(new Date(date), "MMMM d, yyyy")
    } catch (error) {
      return String(date)
    }
  }

  // Go back to billing list
  const handleGoBack = () => {
    window.history.back()
  }

  // Approve bill
  const handleApprove = () => {
    setBill({
      ...bill,
      billingstatus: "Approved", // Update the local state correctly
    });
  
    console.log("Current appointment ID:", currentAppointment?.appointmentid);
  
    axios.post(`${apiUrl}/appointments/billingStatus`, {
      appointmentid: currentAppointment?.appointmentid,
      billingstatus: "Approved",
    })
    .then((response) => {
      console.log("Appointment billing status updated:", response.data);
      alert("Bill has been approved");
    })
    .catch((err) => {
      console.error("Failed to update billing status:", err);
      setError("Failed to update status: " + (err.message || "Unknown error"));
    });
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="mt-2 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
        <button onClick={handleGoBack} className="mt-4 flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Billing List
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl print:py-2">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 print:hidden">
        <div className="flex items-center">
          <button onClick={handleGoBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Bill Review</h1>
            <p className="text-gray-600">Review and edit patient billing information</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </button>

          <button
            onClick={() => {
              handleApprove(); // Call the handleApprove function
              alert("Bill has been approved"); // Alert the user after the action
            }}
            className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </button>


          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Bill
            </button>
          )}
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Medical Billing Statement</h1>
          <p className="text-gray-600">Statement Date: {format(new Date(), "MMMM d, yyyy")}</p>
        </div>
      </div>

      {/* Bill information */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header section */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold">Patient Information</h2>
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Name:</span> {bill.patientName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">ID:</span> {bill.patientId}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Date:</span> {formatDate(bill.appointmentDate)}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Doctor:</span> {bill.doctorName}
              </p>
            </div>
          </div>
        </div>

        {/* Bill details */}
        <div className="p-4">
          {/* Appointment type and doctor type */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              {isEditing ? (
                <select
                  value={bill.appointmentType}
                  onChange={(e) => handleAppointmentTypeChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="procedure">Procedure</option>
                  {appointmentTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{bill.appointmentType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Type</label>
              {isEditing ? (
                <select
                  value={bill.doctorType}
                  onChange={(e) => handleDoctorTypeChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                >
                  <option value="general">General Practitioner</option>
                  <option value="specialist">Specialist</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">
                  {bill.doctorType === "general" ? "General Practitioner" : "Specialist"}
                </p>
              )}
            </div>
          </div>

          {/* Billing table */}
          <table className="w-full mb-6">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Item</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700 text-right">Cost</th>
                {isEditing && <th className="px-4 py-2 w-10"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Doctor type fee */}
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {bill.doctorType === "specialist" ? "Specialist Care" : "Primary Care"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">1</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={bill.doctorTypeFee}
                        onChange={(e) => handleNumericChange("doctorTypeFee", e.target.value)}
                        className="w-20 rounded-md border border-gray-300 p-1 text-sm text-right"
                      />
                    </div>
                  ) : (
                    `$${bill.doctorTypeFee.toFixed(2)}`
                  )}
                </td>
                {isEditing && <td></td>}
              </tr>

              {/* Appointment type fee */}
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {bill.appointmentType.charAt(0).toUpperCase() + bill.appointmentType.slice(1)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">1</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={bill.appointmentTypeFee}
                        onChange={(e) => handleNumericChange("appointmentTypeFee", e.target.value)}
                        className="w-20 rounded-md border border-gray-300 p-1 text-sm text-right"
                      />
                    </div>
                  ) : (
                    `$${bill.appointmentTypeFee.toFixed(2)}`
                  )}
                </td>
                {isEditing && <td></td>}
              </tr>

              {/* Material items */}
              {bill.materialItems.length > 0 && (
                <tr>
                  <td colSpan={isEditing ? 4 : 3} className="px-4 py-2 text-sm font-medium text-gray-700">
                    Materials Used
                  </td>
                </tr>
              )}

              {bill.materialItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 pl-6">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMaterialNameChange(item.id, e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-1 text-sm"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleMaterialQuantityChange(item.id, e.target.value)}
                        className="w-20 rounded-md border border-gray-300 p-1 text-sm"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.cost}
                          onChange={(e) => handleMaterialCostChange(item.id, e.target.value)}
                          className="w-20 rounded-md border border-gray-300 p-1 text-sm text-right"
                        />
                      </div>
                    ) : (
                      `$${item.cost.toFixed(2)}`
                    )}
                  </td>
                  {isEditing && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemoveMaterialItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {/* Add material button */}
              {isEditing && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 pl-6">
                    <button
                      onClick={handleAddMaterialItem}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Material Item
                    </button>
                  </td>
                </tr>
              )}

              {/* Additional fees */}
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">Additional Fees</td>
                <td className="px-4 py-3 text-sm text-gray-900">-</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={bill.additionalFees}
                        onChange={(e) => handleNumericChange("additionalFees", e.target.value)}
                        className="w-20 rounded-md border border-gray-300 p-1 text-sm text-right"
                      />
                    </div>
                  ) : (
                    `$${bill.additionalFees.toFixed(2)}`
                  )}
                </td>
                {isEditing && <td></td>}
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Subtotal:</span>
              <span className="text-sm text-gray-900">${calculateSubtotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Discount:</span>
              <div className="flex items-center">
                {isEditing ? (
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bill.discount}
                      onChange={(e) => handleNumericChange("discount", e.target.value)}
                      className="w-20 rounded-md border border-gray-300 p-1 text-sm text-right"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-900">${bill.discount.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-700">Insurance Coverage:</span>
              <div className="flex items-center">
                {isEditing ? (
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bill.insuranceCoverage}
                      onChange={(e) => handleNumericChange("insuranceCoverage", e.target.value)}
                      className="w-20 rounded-md border border-gray-300 p-1 text-sm text-right"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-900">${bill.insuranceCoverage.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-4">
              <span>Total Amount Due:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            {isEditing ? (
              <textarea
                value={bill.notes}
                onChange={(e) => setBill({ ...bill, notes: e.target.value })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700 border border-gray-200 rounded-md p-2 bg-gray-50 min-h-[3rem]">
                {bill.notes || "No notes"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-8 text-center text-sm text-gray-500">
        <p>Thank you for choosing our medical services.</p>
        <p>For billing inquiries, please contact our billing department at (555) 123-4567.</p>
      </div>
    </div>
  )
}
