import { useState } from "react";
import {
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const currentUser =
        userCredential.user;

      const userDoc = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      let role = "user";

      if (userDoc.exists()) {
        role =
          userDoc.data().role || "user";
      }

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "staff") {
        navigate("/staff", { replace: true });
      } else {
        navigate("/dashboard", {
          replace: true
        });
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Invalid email or password."
        );
      } else if (
        error.code ===
        "auth/user-not-found"
      ) {
        setError(
          "No account found with this email."
        );
      } else if (
        error.code ===
        "auth/wrong-password"
      ) {
        setError(
          "Incorrect password."
        );
      } else if (
        error.code ===
        "auth/too-many-requests"
      ) {
        setError(
          "Too many attempts. Please try again later."
        );
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        <div style={styles.brand}>

          <div style={styles.logoIcon}>
            ✓
          </div>

          <h1 style={styles.logo}>
            ComplaintHub
          </h1>

          <p style={styles.tagline}>
            Complaint Management System
          </p>

        </div>

        <div style={styles.card}>

          <h2 style={styles.title}>
            Welcome back
          </h2>

          <p style={styles.subtitle}>
            Sign in to manage your complaints.
          </p>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div style={styles.field}>

              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
                style={styles.input}
              />

            </div>

            <div style={styles.field}>

              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                required
                style={styles.input}
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <div style={styles.registerSection}>

            <span style={styles.registerText}>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              style={styles.registerButton}
            >
              Create Account
            </button>

          </div>

        </div>

        <p style={styles.footer}>
          ComplaintHub © 2026
        </p>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    padding: "30px"
  },

  container: {
    width: "100%",
    maxWidth: "440px"
  },

  brand: {
    textAlign: "center",
    marginBottom: "30px"
  },

  logoIcon: {
    width: "52px",
    height: "52px",
    margin: "0 auto 12px",
    borderRadius: "14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "700"
  },

  logo: {
    margin: 0,
    color: "#111827",
    fontSize: "28px"
  },

  tagline: {
    margin: "7px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "35px",
    boxShadow:
      "0 8px 30px rgba(0, 0, 0, 0.06)"
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "25px"
  },

  subtitle: {
    margin: "8px 0 28px",
    color: "#6b7280",
    fontSize: "14px"
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "20px",
    fontSize: "14px"
  },

  field: {
    marginBottom: "20px"
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
    color: "#111827",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    outline: "none"
  },

  loginButton: {
    width: "100%",
    padding: "13px",
    marginTop: "5px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer"
  },

  registerSection: {
    marginTop: "25px",
    paddingTop: "22px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center"
  },

  registerText: {
    color: "#6b7280",
    fontSize: "14px"
  },

  registerButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "5px",
    fontSize: "14px"
  },

  footer: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "12px",
    marginTop: "25px"
  }

};

export default Login;