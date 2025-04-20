import React, { useState } from "react"
import { ArrowRight, CreditCard, DollarSign, FileText, Filter, Search } from 'lucide-react'

export default function ReceptionistBilling() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("recent")

  // Sample data for bills
  const bills = {
    pending: [
      {
        patientName: "Sarah Johnson",
        patientId: "PT-78945",
        status: "Pending Review",
        appointmentDate: "April 15, 2025",
        doctor: "Dr. Michael Chen",
        doctorType: "Specialist",
        amount: 150.00,
        insurance: "Blue Cross"
      },
      {
        patientName: "Robert Martinez",
        patientId: "PT-65432",
        status: "Pending Review",
        appointmentDate: "April 14, 2025",
        doctor: "Dr. Sarah Williams",
        doctorType: "General",
        amount: 85.00,
        insurance: "Aetna"
      },
      {
        patientName: "Emily Thompson",
        patientId: "PT-92371",
        status: "Pending Review",
        appointmentDate: "April 13, 2025",
        doctor: "Dr. James Wilson",
        doctorType: "Specialist",
        amount: 320.00,
        insurance: null,
        selfPay: true
      }
    ],
    approved: [
      {
        patientName: "David Wilson",
        patientId: "PT-45678",
        status: "Approved",
        appointmentDate: "April 12, 2025",
        doctor: "Dr. Lisa Johnson",
        doctorType: "General",
        amount: 120.00,
        insurance: "United Healthcare"
      }
    ],
    paid: [],
    all: [] // This would be populated with all bills
  }

  // Populate the "all" category with all bills
  bills.all = [...bills.pending, ...bills.approved, ...bills.paid]

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option)
  }

  // Filter bills based on search query
  const filterBills = (bills, query) => {
    if (!query) return bills
    
    return bills.filter(bill => 
      bill.patientName.toLowerCase().includes(query.toLowerCase()) ||
      bill.patientId.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Sort bills based on selected option
  const sortBills = (bills, option) => {
    switch(option) {
      case "recent":
        return [...bills]
      case "oldest":
        return [...bills].reverse()
      case "highest":
        return [...bills].sort((a, b) => b.amount - a.amount)
      case "lowest":
        return [...bills].sort((a, b) => a.amount - b.amount)
      default:
        return bills
    }
  }

  // Get current bills based on active tab, search, and sort
  const getCurrentBills = () => {
    const filteredBills = filterBills(bills[activeTab], searchQuery)
    return sortBills(filteredBills, sortOption)
  }

  // Handle review bill
  const handleReviewBill = (patientId) => {
    console.log(`Reviewing bill for patient: ${patientId}`)
  }

  // Handle collect payment
  const handleCollectPayment = (patientId) => {
    console.log(`Collecting payment for patient: ${patientId}`)
  }

  // Handle create new bill
  const handleCreateNewBill = () => {
    console.log("Creating new bill")
  }

  // Get current bills
  const currentBills = getCurrentBills()

  return (
    <div className="flex-1 space-y-4 p-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <div className="flex items-center gap-2">
          <button 
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            onClick={() => console.log("Filter clicked")}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button 
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-gray-800"
            onClick={handleCreateNewBill}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create New Bill
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex border-b">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === "pending" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabChange("pending")}
          >
            Pending Review
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === "approved" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabChange("approved")}
          >
            Approved
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === "paid" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabChange("paid")}
          >
            Paid
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabChange("all")}
          >
            All Bills
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="search" 
                placeholder="Search bills by patient name or ID..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-md border border-gray-200 pl-8 py-2 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
              />
            </div>
            <select 
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          <div className="grid gap-4">
            {currentBills.map((bill, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{bill.patientName}</h2>
                      <p className="text-sm text-gray-500">Patient ID: {bill.patientId}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      bill.status === "Approved" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-yellow-50 text-yellow-800"
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Appointment Date</p>
                      <p className="text-sm text-gray-500">{bill.appointmentDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Doctor</p>
                      <p className="text-sm text-gray-500">{bill.doctor} ({bill.doctorType})</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-sm font-semibold">${bill.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0 flex justify-between border-t border-gray-100 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    {bill.insurance ? (
                      <>
                        <CreditCard className="mr-1 h-4 w-4" />
                        Insurance: {bill.insurance}
                      </>
                    ) : (
                      <>
                        <DollarSign className="mr-1 h-4 w-4" />
                        Self-pay
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
                      onClick={() => handleReviewBill(bill.patientId)}
                    >
                      Review Bill
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    {bill.status === "Approved" && (
                      <button 
                        className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-gray-800"
                        onClick={() => handleCollectPayment(bill.patientId)}
                      >
                        Collect Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {currentBills.length === 0 && (
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-1 text-center">
                  <FileText className="h-10 w-10 text-gray-400" />
                  <h3 className="text-lg font-medium">No {activeTab} bills</h3>
                  <p className="text-sm text-gray-500">{activeTab === "all" ? "All" : activeTab} bills will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}