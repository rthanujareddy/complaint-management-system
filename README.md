# ComplaintHub – Complaint Management System

A role-based complaint management web application that allows users to submit and track complaints while enabling administrators and support staff to manage, assign, and resolve them.

## 📌 Overview

ComplaintHub provides a centralized platform for handling complaints through three different roles:

- **User** – Submit complaints and track their status.
- **Admin** – View all complaints, assign complaints to staff, and manage statuses.
- **Staff** – View complaints assigned to them and update their progress.

The application uses **React** for the frontend and **Firebase** for authentication and cloud data storage.

---

## ✨ Features

### 👤 User

- User registration and login
- Submit a new complaint
- Provide complaint title, description, category and priority
- View previously submitted complaints
- Track complaint status
- Logout securely

### 👨‍💼 Admin

- Admin authentication
- View all submitted complaints
- Dashboard statistics
- View complaint category and priority
- Assign complaints to support staff
- Update complaint status
- Monitor pending, in-progress and resolved complaints

### 🧑‍💻 Staff

- Staff authentication
- View complaints assigned to them
- View complaint details
- View priority and category
- Update complaint status
- Track assigned, pending, in-progress and resolved complaints

---

## 🔄 Complaint Workflow

```text
User
  │
  │ Submit Complaint
  ▼
ComplaintHub
  │
  ▼
Admin Dashboard
  │
  │ Assign Staff
  ▼
Staff Dashboard
  │
  │ Update Status
  ▼
In Progress / Resolved
  │
  ▼
User tracks updated status
```

---

## 🛠️ Technology Stack

### Frontend

- React
- JavaScript
- Vite
- React Router

### Backend / Cloud

- Firebase Authentication
- Cloud Firestore

### Development Tools

- VS Code
- npm
- Git / GitHub

---

## 🏗️ Project Structure

```text
complaint-management-system/
│
├── src/
│   ├── assets/
│   │
│   ├── firebase/
│   │   └── Firebase configuration
│   │
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── MyComplaints.jsx
│   │   ├── Register.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── SubmitComplaint.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── README.md
```

---

## 🔥 Firebase Usage

Firebase is used for the application's backend services.

### Firebase Authentication

Firebase Authentication handles:

- User registration
- User login
- User logout
- Authentication state

### Cloud Firestore

Cloud Firestore stores application data such as:

- User information
- Complaint information
- Complaint status
- Complaint priority
- Staff assignment

The application updates complaint information in Firestore so that changes made by administrators or staff can be reflected when users view their complaints.

---

## 👥 Role-Based Workflow

### User

After registration, a user account is created with the `user` role.

The user can submit complaints and view their complaints.

### Admin

The administrator can view all complaints and assign a complaint to a staff member.

When a complaint is assigned, the assigned staff information is stored with the complaint.

### Staff

The staff dashboard retrieves complaints assigned to the currently authenticated staff member.

Staff members can update the complaint status.

### Status Flow

```text
Pending
   ↓
In Progress
   ↓
Resolved
```

---

## 📊 Dashboard

The application provides dashboard statistics for administrators and staff.

### Admin Dashboard

Displays:

- Total complaints
- Pending complaints
- In-progress complaints
- Resolved complaints

### Staff Dashboard

Displays:

- Assigned complaints
- Pending complaints
- In-progress complaints
- Resolved complaints

---

## 🚀 Running the Project Locally

```bash
git clone <your-github-repository-url>
cd complaint-management-system
npm install
npm run dev
```

---

## 🎯 Main Objectives

The project was developed to demonstrate:

- Frontend application development using React
- Component-based UI development
- Client-side routing
- Authentication
- Cloud database integration
- Role-based application workflows
- CRUD operations with Firestore
- Real-world complaint management workflow

---

## 🔮 Future Enhancements

Possible future improvements include:

- Email notifications for complaint updates
- Complaint search and filtering
- File and image attachments
- Complaint comments and communication between users and staff
- Admin analytics and charts
- Complaint history and activity logs
- Improved mobile responsiveness
- Automated complaint categorization

---

## 🌐 Live Demo

[**ComplaintHub – Live Demo**](https://complaint-management-system-gamma-two.vercel.app/)

---

## 👩‍💻 Project

**ComplaintHub – Complaint Management System**

A role-based web application designed to simplify the process of submitting, assigning, tracking, and resolving complaints.
