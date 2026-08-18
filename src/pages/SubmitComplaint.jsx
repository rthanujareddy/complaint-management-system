import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      setError(
        "Please login before submitting a complaint."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addDoc(
        collection(db, "complaints"),
        {
          title: title.trim(),
          category,
          priority,
          description:
            description.trim(),
          status: "Pending",
          userId: auth.currentUser.uid,
          userEmail:
            auth.currentUser.email,
          createdAt:
            serverTimestamp()
        }
      );

      navigate("/my-complaints");

    } catch (error) {
      console.error(error);

      setError(
        "Failed to submit complaint."
      );

    } finally {
      setLoading(false);
    }
  };

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
          style={styles.dashboardButton}
        >
          Dashboard
        </button>

      </header>

      <main style={styles.main}>

        <div style={styles.heading}>

          <h2 style={styles.title}>
            Submit a Complaint
          </h2>

          <p style={styles.description}>
            Provide the details of the issue
            you would like to report.
          </p>

        </div>

        <div style={styles.card}>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={styles.field}>

              <label style={styles.label}>
                Complaint Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter complaint title"
                required
                style={styles.input}
              />

            </div>

            <div style={styles.field}>

              <label style={styles.label}>
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
                style={styles.input}
              >

                <option value="">
                  Select category
                </option>

                <option value="Infrastructure">
                  Infrastructure
                </option>

                <option value="Internet">
                  Internet
                </option>

                <option value="Cleanliness">
                  Cleanliness
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Hostel">
                  Hostel
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div style={styles.field}>

              <label style={styles.label}>
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                style={styles.input}
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

            <div style={styles.field}>

              <label style={styles.label}>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe your complaint"
                rows="7"
                required
                style={styles.textarea}
              />

            </div>

            <div style={styles.actions}>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  opacity:
                    loading ? 0.7 : 1
                }}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                style={styles.cancelButton}
              >
                Back to Dashboard
              </button>

            </div>

          </form>

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

  dashboardButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: "600"
  },

  main: {
    maxWidth: "800px",
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

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "35px",
    boxShadow:
      "0 4px 18px rgba(0, 0, 0, 0.05)"
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "13px 15px",
    borderRadius: "8px",
    marginBottom: "25px",
    fontSize: "14px"
  },

  field: {
    marginBottom: "22px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600"
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    outline: "none"
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    outline: "none"
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px"
  },

  submitButton: {
    width: "100%",
    padding: "13px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer"
  },

  cancelButton: {
    width: "100%",
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
    fontSize: "13px"
  }

};

export default SubmitComplaint;