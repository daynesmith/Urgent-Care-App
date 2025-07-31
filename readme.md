# Urgent Care Management System – Medical Clinic Web App

**User Authentication | Role-Based Dashboards | Appointment Scheduling**

---

## Medical App Demo

![MedicalAppGif](path/to/your/medicalapp.gif)

---

## Overview

This full-stack web application helps manage patients, doctors, appointments, and billing for an urgent care clinic. Built with Node.js, MySQL, and Vite, it offers secure role-based access and streamlined workflows for medical staff and patients.

---

## Features

- **User Authentication:** Secure login and registration with role-based access (patient, doctor, receptionist).  
- **Patient Dashboard:** Schedule appointments, view status, and track visit history.  
- **Doctor Dashboard:** Review and approve appointment requests, access patient visit summaries.  
- **Receptionist Dashboard:** Manage appointments, walk-ins, and billing processes.  
- **Appointment Scheduling:** Real-time availability and approval workflows.  
- **Billing & Visit Tracking:** Integrated billing generation triggered by visit updates.

---

## Technology Stack

- **Frontend:** Vite + React (or your frontend tech)  
- **Backend:** Node.js + Express  
- **Database:** MySQL with triggers, views, and stored procedures  
- **Authentication:** JWT-based secure login

---

## Collaborators

- [Your Name]  
- (Add any teammates if applicable)

---

## Installation & Setup

1. Run `npm install` in **both** the `backend` and `frontend` directories to install dependencies.  
2. Create a `.env` file in both root directories (backend and frontend) based on the `.envexample` file provided.  
3. Replace environment variables in the `.env` files with your specific values.  
4. Make sure you have a MySQL database created with the same name as specified in your environment variables.  
5. To start the frontend, navigate to the frontend directory and run:  
   ```bash
   npm run dev
