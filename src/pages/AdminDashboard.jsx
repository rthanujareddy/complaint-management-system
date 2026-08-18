import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] =
    useState([]);

  const [staff, setStaff] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const checkAdminAndLoad = async () => {

      try {

        const currentUser =
          auth.currentUser;

        if (!currentUser) {
          navigate("/login", {
            replace: true
          });
          return;
        }

        const userDoc = await getDocs(
          query(
            collection(db, "users")
          )
        );

        const currentUserDoc =
          userDoc.docs.find(
            (item) =>
              item.id === currentUser.uid
          );

        const role =
          currentUserDoc?.data()?.role ||
          "user";

        if (role !== "admin") {

          if (role === "staff") {
            navigate("/staff", {
              replace: true
            });
          } else {
            navigate("/dashboard", {
              replace: true
            });
          }

          return;
        }

        await fetchData();

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load admin data."
        );

      } finally {

        setLoading(false);

      }
    };

    checkAdminAndLoad();

  }, [navigate]);

  const fetchData = async () => {

    const complaintsQuery = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const complaintsSnapshot =
      await getDocs(complaintsQuery);

    const complaintList =
      complaintsSnapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data()
        })
      );

    const usersSnapshot =
      await getDocs(
        collection(db, "users")
      );

    const staffList =
      usersSnapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data()
        }))
        .filter(
          (user) =>
            user.role === "staff"
        );

    setComplaints(complaintList);
    setStaff(staffList);
  };

  const assignStaff = async (
    complaintId,
    staffId
  ) => {

    if (!staffId) return;

    try {

      const selectedStaff =
        staff.find(
          (member) =>
            member.id === staffId
        );

      await updateDoc(
        doc(
          db,
          "complaints",
          complaintId
        ),
        {
          assignedStaffId: staffId,
          assignedStaffName:
            selectedStaff?.name ||
            selectedStaff?.email ||
            "Support Staff",
          status: "In Progress"
        }
      );

      setComplaints(
        (currentComplaints) =>
          currentComplaints.map(
            (complaint) =>
              complaint.id === complaintId
                ? {
                    ...complaint,
                    assignedStaffId:
                      staffId,
                    assignedStaffName:
                      selectedStaff?.name ||
                      selectedStaff?.email ||
                      "Support Staff",
                    status:
                      "In Progress"
                  }
                : complaint
          )
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to assign staff."
      );
    }
  };

  const updateStatus = async (
    complaintId,
    newStatus
  ) => {

    try {

      await updateDoc(
        doc(
          db,
          "complaints",
          complaintId
        ),
        {
          status: newStatus
        }
      );

      setComplaints(
        (currentComplaints) =>
          currentComplaints.map(
            (complaint) =>
              complaint.id === complaintId
                ? {
                    ...complaint,
                    status: newStatus
                  }
                : complaint
          )
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to update status."
      );
    }
  };

  const handleLogout = async () => {

    await auth.signOut();

    navigate("/login", {
      replace: true
    });
  };

  const total = complaints.length;

  const pending =
    complaints.filter(
      (complaint) =>
        complaint.status === "Pending"
    ).length;

  const inProgress =
    complaints.filter(
      (complaint) =>
        complaint.status === "In Progress"
    ).length;

  const resolved =
    complaints.filter(
      (complaint) =>
        complaint.status === "Resolved"
    ).length;

  const getStatusStyle = (status) => {

    if (status === "Resolved") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534"
      };
    }

    if (status === "In Progress") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8"
      };
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e"
    };
  };

  const getPriorityStyle = (
    priority
  ) => {

    if (
      priority?.toLowerCase() ===
      "high"
    ) {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b"
      };
    }

    if (
      priority?.toLowerCase() ===
      "medium"
    ) {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e"
      };
    }

    return {
      backgroundColor: "#dcfce7",
      color: "#166534"
    };
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <header style={styles.header}>

        <div>
          <h1 style={styles.logo}>
            ComplaintHub
          </h1>

          <p style={styles.headerSubtitle}>
            Administrator Panel
          </p>
        </div>

        <div style={styles.headerRight}>

          <span style={styles.adminBadge}>
            ADMIN
          </span>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      <main style={styles.main}>

        <div style={styles.pageHeading}>

          <h2 style={styles.title}>
            Dashboard Overview
          </h2>

          <p style={styles.description}>
            Monitor, assign and manage
            submitted complaints.
          </p>

        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.statsGrid}>

          <StatCard
            title="Total Complaints"
            value={total}
            icon="📊"
          />

          <StatCard
            title="Pending"
            value={pending}
            icon="⏳"
          />

          <StatCard
            title="In Progress"
            value={inProgress}
            icon="🔧"
          />

          <StatCard
            title="Resolved"
            value={resolved}
            icon="✅"
          />

        </div>

        <section>

          <div style={styles.sectionHeader}>

            <div>

              <h2 style={styles.sectionTitle}>
                All Complaints
              </h2>

              <p
                style={
                  styles.sectionSubtitle
                }
              >
                Review and manage
                complaints submitted by
                users.
              </p>

            </div>

            <div style={styles.countBadge}>
              {total} Total
            </div>

          </div>

          {complaints.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📭
              </div>

              <h3>
                No complaints yet
              </h3>

              <p>
                Submitted complaints will
                appear here.
              </p>

            </div>

          ) : (

            <div style={styles.complaintsList}>

              {complaints.map(
                (complaint, index) => (

                  <div
                    key={complaint.id}
                    style={
                      styles.complaintCard
                    }
                  >

                    <div
                      style={
                        styles.complaintTop
                      }
                    >

                      <div>

                        <span
                          style={
                            styles.complaintNumber
                          }
                        >
                          Complaint #
                          {index + 1}
                        </span>

                        <h3
                          style={
                            styles.complaintTitle
                          }
                        >
                          {complaint.title}
                        </h3>

                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(
                            complaint.status
                          )
                        }}
                      >
                        {complaint.status ||
                          "Pending"}
                      </span>

                    </div>

                    <p
                      style={
                        styles.descriptionText
                      }
                    >
                      {complaint.description}
                    </p>

                    <div
                      style={
                        styles.infoGrid
                      }
                    >

                      <div>
                        <span
                          style={
                            styles.infoLabel
                          }
                        >
                          Category
                        </span>

                        <span
                          style={
                            styles.infoValue
                          }
                        >
                          {complaint.category ||
                            "General"}
                        </span>
                      </div>

                      <div>
                        <span
                          style={
                            styles.infoLabel
                          }
                        >
                          Priority
                        </span>

                        <span
                          style={{
                            ...styles.priorityBadge,
                            ...getPriorityStyle(
                              complaint.priority
                            )
                          }}
                        >
                          {complaint.priority ||
                            "Low"}
                        </span>
                      </div>

                      <div>
                        <span
                          style={
                            styles.infoLabel
                          }
                        >
                          Submitted By
                        </span>

                        <span
                          style={
                            styles.infoValue
                          }
                        >
                          {complaint.userEmail ||
                            "Unknown"}
                        </span>
                      </div>

                      <div>
                        <span
                          style={
                            styles.infoLabel
                          }
                        >
                          Assigned Staff
                        </span>

                        <span
                          style={
                            styles.infoValue
                          }
                        >
                          {complaint.assignedStaffName ||
                            "Not assigned"}
                        </span>
                      </div>

                    </div>

                    <div
                      style={
                        styles.controls
                      }
                    >

                      <div
                        style={
                          styles.controlGroup
                        }
                      >

                        <label
                          style={
                            styles.controlLabel
                          }
                        >
                          Assign Staff
                        </label>

                        <select
                          value={
                            complaint.assignedStaffId ||
                            ""
                          }
                          onChange={(e) =>
                            assignStaff(
                              complaint.id,
                              e.target.value
                            )
                          }
                          style={
                            styles.select
                          }
                        >

                          <option value="">
                            Select staff member
                          </option>

                          {staff.map(
                            (member) => (

                              <option
                                key={member.id}
                                value={member.id}
                              >
                                {member.name ||
                                  member.email}
                              </option>

                            )
                          )}

                        </select>

                      </div>

                      <div
                        style={
                          styles.controlGroup
                        }
                      >

                        <label
                          style={
                            styles.controlLabel
                          }
                        >
                          Update Status
                        </label>

                        <select
                          value={
                            complaint.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateStatus(
                              complaint.id,
                              e.target.value
                            )
                          }
                          style={
                            styles.select
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>

                        </select>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      <footer style={styles.footer}>
        ComplaintHub © 2026
      </footer>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon
}) {
  return (
    <div style={styles.statCard}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>

        <p style={styles.statTitle}>
          {title}
        </p>

        <h2 style={styles.statValue}>
          {value}
        </h2>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#111827"
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#111827"
  },

  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "18px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logo: {
    margin: 0,
    fontSize: "26px",
    color: "#111827"
  },

  headerSubtitle: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  adminBadge: {
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },

  logoutButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: "600"
  },

  main: {
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "50px 30px"
  },

  pageHeading: {
    marginBottom: "35px"
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827"
  },

  description: {
    color: "#6b7280",
    marginTop: "8px"
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "14px 18px",
    borderRadius: "8px",
    marginBottom: "25px"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "50px"
  },

  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow:
      "0 3px 12px rgba(0, 0, 0, 0.04)"
  },

  statIcon: {
    fontSize: "30px"
  },

  statTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px"
  },

  statValue: {
    margin: "5px 0 0",
    fontSize: "28px",
    color: "#111827"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#111827"
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280"
  },

  countBadge: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600"
  },

  complaintsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  complaintCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "28px",
    boxShadow:
      "0 3px 12px rgba(0, 0, 0, 0.04)"
  },

  complaintTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px"
  },

  complaintNumber: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "600"
  },

  complaintTitle: {
    margin: "7px 0 0",
    fontSize: "20px",
    color: "#111827"
  },

  statusBadge: {
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap"
  },

  descriptionText: {
    color: "#4b5563",
    lineHeight: "1.6",
    margin: "20px 0 25px"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px",
    borderTop: "1px solid #f0f0f0",
    borderBottom: "1px solid #f0f0f0",
    padding: "20px 0"
  },

  infoLabel: {
    display: "block",
    fontSize: "12px",
    color: "#9ca3af",
    marginBottom: "7px"
  },

  infoValue: {
    display: "block",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    wordBreak: "break-word"
  },

  priorityBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "700"
  },

  controls: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
    marginTop: "25px"
  },

  controlGroup: {
    display: "flex",
    flexDirection: "column"
  },

  controlLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px"
  },

  select: {
    padding: "11px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    cursor: "pointer"
  },

  emptyState: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "60px",
    textAlign: "center"
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "15px"
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
    fontSize: "13px"
  }

};

export default AdminDashboard;