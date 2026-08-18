import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (!currentUser) {
            navigate("/login", {
              replace: true
            });
            return;
          }

          try {
            const userDoc = await getDoc(
              doc(
                db,
                "users",
                currentUser.uid
              )
            );

            const role = userDoc.exists()
              ? userDoc.data().role || "user"
              : "user";

            if (role === "admin") {
              navigate("/admin", {
                replace: true
              });
              return;
            }

            if (role === "staff") {
              navigate("/staff", {
                replace: true
              });
              return;
            }

            setUser(currentUser);

          } catch (error) {
            console.error(error);
            navigate("/login", {
              replace: true
            });
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);

    navigate("/login", {
      replace: true
    });
  };

  if (loading || !user) {
    return (
      <div style={styles.loading}>
        Loading...
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
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>

      </header>

      <main style={styles.main}>

        <div style={styles.welcomeSection}>

          <h2 style={styles.welcomeTitle}>
            Welcome back 👋
          </h2>

          <p style={styles.welcomeText}>
            Manage your complaints and track
            their progress from one place.
          </p>

        </div>

        <div style={styles.cards}>

          <div style={styles.card}>

            <div style={styles.icon}>
              📝
            </div>

            <h3 style={styles.cardTitle}>
              Submit a Complaint
            </h3>

            <p style={styles.cardText}>
              Report a new issue and provide
              the necessary details.
            </p>

            <button
              onClick={() =>
                navigate("/submit-complaint")
              }
              style={styles.primaryButton}
            >
              Submit Complaint
            </button>

          </div>

          <div style={styles.card}>

            <div style={styles.icon}>
              📋
            </div>

            <h3 style={styles.cardTitle}>
              My Complaints
            </h3>

            <p style={styles.cardText}>
              View your complaints and track
              their current status.
            </p>

            <button
              onClick={() =>
                navigate("/my-complaints")
              }
              style={styles.secondaryButton}
            >
              View Complaints
            </button>

          </div>

        </div>

        <div style={styles.accountCard}>

          <h3 style={styles.accountTitle}>
            Account Information
          </h3>

          <p style={styles.accountText}>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p style={styles.accountText}>
            <strong>Role:</strong> User
          </p>

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
    color: "#1f2937"
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937"
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
    fontWeight: "600",
    fontSize: "14px"
  },

  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "60px 30px"
  },

  welcomeSection: {
    marginBottom: "40px"
  },

  welcomeTitle: {
    fontSize: "32px",
    margin: "0 0 10px",
    color: "#111827"
  },

  welcomeText: {
    color: "#4b5563",
    fontSize: "16px",
    margin: 0
  },

  cards: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "30px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.05)"
  },

  icon: {
    fontSize: "32px",
    marginBottom: "15px"
  },

  cardTitle: {
    fontSize: "21px",
    margin: "0 0 10px",
    color: "#111827"
  },

  cardText: {
    color: "#4b5563",
    lineHeight: "1.6",
    marginBottom: "25px"
  },

  primaryButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
  },

  secondaryButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #2563eb",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
  },

  accountCard: {
    marginTop: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "25px 30px",
    border: "1px solid #e5e7eb"
  },

  accountTitle: {
    margin: "0 0 20px",
    color: "#111827"
  },

  accountText: {
    color: "#4b5563",
    margin: "8px 0"
  },

  footer: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
    fontSize: "13px"
  }

};

export default Dashboard;