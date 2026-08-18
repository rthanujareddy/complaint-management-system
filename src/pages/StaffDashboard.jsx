import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkStaffAndLoad = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate("/login", {
            replace: true
          });
          return;
        }

        // Get ONLY the currently logged-in user's document.
        // This avoids trying to read the entire users collection.
        const userDoc = await getDoc(
          doc(db, "users", currentUser.uid)
        );

        const role = userDoc.exists()
          ? userDoc.data().role
          : "user";

        // Make sure only staff can access this dashboard.
        if (role !== "staff") {
          if (role === "admin") {
            navigate("/admin", {
              replace: true
            });
          } else {
            navigate("/dashboard", {
              replace: true
            });
          }

          return;
        }

        // Load complaints assigned to this staff member.
        const complaintsQuery = query(
          collection(db, "complaints"),
          where(
            "assignedStaffId",
            "==",
            currentUser.uid
          )
        );

        const snapshot = await getDocs(
          complaintsQuery
        );

        const complaintList = snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data()
          })
        );

        complaintList.sort((a, b) => {
          const dateA =
            a.createdAt?.toMillis?.() || 0;

          const dateB =
            b.createdAt?.toMillis?.() || 0;

          return dateB - dateA;
        });

        setComplaints(complaintList);
        setError("");
      } catch (error) {
        console.error(
          "Staff dashboard error:",
          error
        );

        setError(
          "Unable to load assigned complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    checkStaffAndLoad();
  }, [navigate]);

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

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to update complaint status."
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

  const pending = complaints.filter(
    (complaint) =>
      complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
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

  const getPriorityStyle = (priority) => {
    if (
      priority?.toLowerCase() === "high"
    ) {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b"
      };
    }

    if (
      priority?.toLowerCase() === "medium"
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
        Loading staff dashboard...
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
            Staff Workspace
          </p>
        </div>

        <div style={styles.headerRight}>

          <span style={styles.staffBadge}>
            SUPPORT STAFF
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

        <div style={styles.heading}>

          <h2 style={styles.title}>
            My Assigned Complaints
          </h2>

          <p style={styles.description}>
            Review complaints assigned to you
            and keep their status up to date.
          </p>

        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.statsGrid}>

          <StatCard
            title="Assigned"
            value={total}
            icon="📋"
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
                Assigned Work
              </h2>

              <p style={styles.sectionSubtitle}>
                Complaints currently assigned
                to your account.
              </p>

            </div>

            <span style={styles.countBadge}>
              {total} Assigned
            </span>

          </div>

          {complaints.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                🎉
              </div>

              <h3 style={styles.emptyTitle}>
                No Complaints Assigned
              </h3>

              <p style={styles.emptyText}>
                You're all caught up! New
                complaints assigned to you
                will appear here.
              </p>

            </div>

          ) : (

            <div style={styles.complaintsList}>

              {complaints.map(
                (complaint, index) => (

                  <div
                    key={complaint.id}
                    style={styles.complaintCard}
                  >

                    <div style={styles.cardTop}>

                      <div>

                        <span
                          style={
                            styles.complaintNumber
                          }
                        >
                          Assigned Complaint #
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

                    <div style={styles.infoGrid}>

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
                          Assigned To
                        </span>

                        <span
                          style={
                            styles.infoValue
                          }
                        >
                          {complaint.assignedStaffName ||
                            "You"}
                        </span>

                      </div>

                    </div>

                    <div
                      style={
                        styles.statusControl
                      }
                    >

                      <div>

                        <label
                          style={
                            styles.controlLabel
                          }
                        >
                          Update Complaint Status
                        </label>

                        <p
                          style={
                            styles.controlHint
                          }
                        >
                          Updating the status
                          automatically updates
                          the user's complaint
                          tracking page.
                        </p>

                      </div>

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
                        style={styles.select}
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

  staffBadge: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
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

  heading: {
    marginBottom: "35px"
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827"
  },

  description: {
    marginTop: "8px",
    color: "#6b7280"
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

  cardTop: {
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

  statusControl: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  },

  controlLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151"
  },

  controlHint: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#6b7280"
  },

  select: {
    minWidth: "180px",
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
    fontSize: "42px",
    marginBottom: "15px"
  },

  emptyTitle: {
    color: "#111827"
  },

  emptyText: {
    color: "#6b7280",
    maxWidth: "500px",
    margin: "0 auto",
    lineHeight: "1.6"
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
    fontSize: "13px"
  }

};

export default StaffDashboard;