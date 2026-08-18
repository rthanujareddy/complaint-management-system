import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {

      if (!auth.currentUser) {
        navigate("/login", {
          replace: true
        });
        return;
      }

      try {
        const complaintsQuery = query(
          collection(db, "complaints"),
          where(
            "userId",
            "==",
            auth.currentUser.uid
          )
        );

        const snapshot =
          await getDocs(complaintsQuery);

        const complaintList =
          snapshot.docs.map(
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

      } catch (error) {
        console.error(error);
        setError(
          "Unable to load complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

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

    if (priority === "High") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b"
      };
    }

    if (priority === "Medium") {
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
        Loading complaints...
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

          <p style={styles.subtitle}>
            Complaint Management System
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          style={styles.logoutButton}
        >
          Dashboard
        </button>

      </header>

      <main style={styles.main}>

        <div style={styles.heading}>

          <h2 style={styles.title}>
            My Complaints
          </h2>

          <p style={styles.description}>
            View and track all the complaints
            you have submitted.
          </p>

        </div>

        <div style={styles.actions}>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.secondaryButton}
          >
            Back to Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/submit-complaint")
            }
            style={styles.primaryButton}
          >
            Submit New Complaint
          </button>

        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!error &&
          complaints.length === 0 && (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📭
              </div>

              <h2 style={styles.emptyTitle}>
                No Complaints Yet
              </h2>

              <p style={styles.emptyText}>
                You haven't submitted any
                complaints yet.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/submit-complaint"
                  )
                }
                style={styles.primaryButton}
              >
                Submit Your First Complaint
              </button>

            </div>
          )}

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
                      Complaint #{index + 1}
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
                        "Medium"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={
                        styles.infoLabel
                      }
                    >
                      Status
                    </span>

                    <span
                      style={
                        styles.infoValue
                      }
                    >
                      {complaint.status ||
                        "Pending"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={
                        styles.infoLabel
                      }
                    >
                      Submitted
                    </span>

                    <span
                      style={
                        styles.infoValue
                      }
                    >
                      {complaint.createdAt
                        ? complaint.createdAt
                            .toDate()
                            .toLocaleString()
                        : "Just now"}
                    </span>
                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </main>

      <footer style={styles.footer}>
        ComplaintHub © 2026
      </footer>

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
    color: "#111827",
    fontFamily: "Arial, sans-serif"
  },

  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "20px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logo: {
    margin: 0,
    fontSize: "26px",
    color: "#111827"
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px"
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
    maxWidth: "1050px",
    margin: "0 auto",
    padding: "50px 30px"
  },

  heading: {
    marginBottom: "30px"
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

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "30px",
    maxWidth: "350px"
  },

  primaryButton: {
    width: "100%",
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },

  secondaryButton: {
    width: "100%",
    padding: "12px 18px",
    borderRadius: "8px",
    border: "1px solid #2563eb",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "14px 18px",
    borderRadius: "8px",
    marginBottom: "25px"
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
    fontSize: "21px",
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
    paddingTop: "20px"
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

  emptyState: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "60px 30px",
    textAlign: "center",
    marginBottom: "25px"
  },

  emptyIcon: {
    fontSize: "42px"
  },

  emptyTitle: {
    color: "#111827"
  },

  emptyText: {
    color: "#6b7280",
    marginBottom: "25px"
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
    fontSize: "13px"
  }

};

export default MyComplaints;