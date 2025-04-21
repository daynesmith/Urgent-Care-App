import { useState, useEffect } from "react"
import axios from "axios"
import { ArrowRight, CreditCard, FileText, Filter, Search } from "lucide-react"
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistBilling() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("recent")
  const [billingStatusByAppointment, setBillingStatusByAppointment] = useState({});
  const [appointments, setAppointments] = useState([])
  const [suppliesByAppointment, setSuppliesByAppointment] = useState({})
  const [inventory, setInventory] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [costByAppointment, setCostByAppointment] = useState({})
  const navigate = useNavigate();
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

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${apiUrl}/appointments/getappointments`)

        if (response.data && Array.isArray(response.data)) {
          const completedAppointments = response.data
            .filter((appointment) => appointment.appointmentstatus === "completed")
            .map((appointment) => ({
              ...appointment,
              patientName: appointment.patient
                ? `${appointment.patient.firstname || ""} ${appointment.patient.lastname || ""}`
                : "Unknown Patient",
            }))

          setAppointments(completedAppointments)
        } else {
          console.error("Invalid appointment data format:", response.data)
          setError("Failed to load appointments: Invalid data format")
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err)
        setError("Failed to load appointments: " + (err.message || "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [apiUrl])

  // Fetch supplies
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const res = await axios.get(`${apiUrl}/visitinfo/getAllVisitSupplies`)

        if (res.data && res.data.visitSupplies && Array.isArray(res.data.visitSupplies)) {
          const grouped = groupBy(res.data.visitSupplies, "visitinfoid")
          setSuppliesByAppointment(grouped)
        } else {
          console.error("Invalid supplies data format:", res.data)
        }
      } catch (err) {
        console.error("Failed to fetch supplies:", err)
        setError((prevError) => prevError + " Failed to load supplies.")
      }
    }

    fetchSupplies()
  }, [apiUrl])

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
        } else {
          console.error("Invalid inventory data format:", res.data)
        }
      } catch (err) {
        console.error("Failed to fetch inventory:", err)
        setError((prevError) => prevError + " Failed to load inventory.")
      }
    }

    fetchInventory()
  }, [apiUrl])

  // Calculate total cost
  const calculateTotalCost = () => {
    const costByAppointment = {}

    if (!appointments.length) {
      return costByAppointment
    }

    appointments.forEach((appointment) => {
      if (!appointment) return

      const { appointmentid, doctorid, specialistid, appointmenttype } = appointment
      let totalCost = 0

      // Base costs
      if (doctorid) {
        totalCost += inventory["Primary Care"] || 0
      }

      if (specialistid && specialistid !== "undefined") {
        totalCost += inventory["Specialist Care"] || 0
      }

      // Appointment type cost
      if (appointmenttype && inventory[appointmenttype]) {
        totalCost += inventory[appointmenttype] || 0
      }

      // Supplies cost
      const supplies = suppliesByAppointment[appointmentid]

      if (supplies && Array.isArray(supplies) && supplies.length > 0) {
        supplies.forEach((supply) => {
          if (!supply) return

          const itemname = supply.inventory?.itemname || supply.name
          const unitCost = supply.inventory?.cost || 0
          const quantity = supply.quantity || 0
          const supplyCost = unitCost * quantity

          if (!isNaN(supplyCost)) {
            totalCost += supplyCost
          }
        })
      }

      // Store the cost per appointment
      costByAppointment[appointmentid] = Number.parseFloat(totalCost.toFixed(2))
    })

    return costByAppointment
  }

  // Update costs when data changes
  useEffect(() => {
    if (appointments.length > 0 && Object.keys(inventory).length > 0) {
      const appointmentCosts = calculateTotalCost()
      setCostByAppointment(appointmentCosts)
    }
  }, [appointments, suppliesByAppointment, inventory])

  // Filter appointments based on search query
  const filterAppointments = (appointments, query) => {
    if (!query) return appointments

    return appointments.filter((appointment) => {
      if (!appointment) return false

      return (
        appointment.patientName?.toLowerCase().includes(query.toLowerCase()) ||
        appointment.patientid?.toLowerCase().includes(query.toLowerCase())
      )
    })
  }

  // Sort appointments based on selected option
  const sortAppointments = (appointments, option) => {
    if (!appointments || !Array.isArray(appointments)) return []

    const sortedAppointments = [...appointments]

    switch (option) {
      case "recent":
        return sortedAppointments.sort((a, b) => new Date(b.requesteddate || 0) - new Date(a.requesteddate || 0))
      case "oldest":
        return sortedAppointments.sort((a, b) => new Date(a.requesteddate || 0) - new Date(b.requesteddate || 0))
      case "highest":
        return sortedAppointments.sort(
          (a, b) => (costByAppointment[b.appointmentid] || 0) - (costByAppointment[a.appointmentid] || 0),
        )
      case "lowest":
        return sortedAppointments.sort(
          (a, b) => (costByAppointment[a.appointmentid] || 0) - (costByAppointment[b.appointmentid] || 0),
        )
      default:
        return sortedAppointments
    }
  }

  // Get current appointments based on active tab, search, and sort
  const getCurrentAppointments = () => {
    const filteredAppointments = filterAppointments(appointments, searchQuery)
    return sortAppointments(filteredAppointments, sortOption)
  }

  // Handle collect payment
  const handleCollectPayment = (appointmentId) => {
    console.log(`Collecting payment for appointment: ${appointmentId}`)
    // Implement your payment collection logic here
  }

  // Get current appointments
  const currentAppointments = getCurrentAppointments()

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
  
    try {
      const date = new Date(dateString);
      // Add one day (in milliseconds)
      date.setDate(date.getDate() + 1);
  
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleReviewBill = (appointmentid) => {
    navigate(`/ReceptionistBillingPage/${appointmentid}`);
  };

  
  

  
  //create billing
  const createBilling = async (appointment) => {
    try {
      const billingPayload = {
        patientid: appointment.patientid,
        appointmentid: appointment.appointmentid,
        amount: costByAppointment[appointment.appointmentid] || 0,
        date: new Date(),
        status: "unpaid",
        billingstatus: billingStatusByAppointment,
      };
  
      const response = await axios.post(`${apiUrl}/receptionist/create`, billingPayload);
  
      if (response.data) {
        console.log("✅ Billing created successfully:", response.data);
      }
    } catch (error) {
      console.error("❌ Failed to create billing:", error);
    }
  };
  

  return (
    <div className="flex-1 space-y-4 p-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Billing Management</h1>
        <div className="flex items-center gap-2">
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>

              {currentAppointments.length > 0 ? (
                <div className="grid gap-4">
                  {currentAppointments.map((apt) => (
                    <div key={apt.appointmentid} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-semibold">{apt.patientName || "Unknown Patient"}</h2>
                            <p className="text-sm text-gray-500">Patient ID: {apt.patientid || "N/A"}</p>
                          </div>
                          
                          {/* Display billing status */}
                
                        </div>
                      </div>


                      <div className="p-4 pt-0">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">Appointment Date</p>
                            <p className="text-sm text-gray-500">{formatDate(apt.requesteddate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Doctor</p>
                            <p className="text-sm text-gray-500">
                              {apt.doctor
                                ? `Dr. ${apt.doctor.firstname || ""} ${apt.doctor.lastname || ""}`
                                : "Not Assigned"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Total Amount</p>
                            <p className="text-sm font-semibold">
                              $
                              {costByAppointment[apt.appointmentid] !== undefined
                                ? costByAppointment[apt.appointmentid].toFixed(2)
                                : "0.00"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0 flex justify-between border-t border-gray-100 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                        </div>
                        <div className="flex gap-2">
                        <button
                        className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
                        onClick={() => {
                          createBilling(apt);           // 🕵️ create the bill sneakily...
                          handleReviewBill(apt.appointmentid); // then navigate
                        }}
                      >
                        Review Bill 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>


                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed border-gray-300">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <FileText className="h-10 w-10 text-gray-400" />
                    <h3 className="text-lg font-medium">No bills found</h3>
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? "No results match your search criteria."
                        : "Completed appointments will appear here."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
