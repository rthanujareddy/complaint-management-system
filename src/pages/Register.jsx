import { useState } from "react";
import {
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  doc,
  setDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: name,
          email: email,
          role: "user",
          createdAt: new Date()
        }
      );

      navigate("/");

    } catch (error) {
      console.error(error);

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "An account with this email already exists."
        );
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        error.code ===
        "auth/weak-password"
      ) {
        setError(
          "Password is too weak."
        );
      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* Brand */}

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

        {/* Register Card */}

        <div style={styles.card}>

          <h2 style={styles.title}>
            Create your account
          </h2>

          <p style={styles.subtitle}>
            Join ComplaintHub and start
            managing your complaints.
          </p>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* Name */}

            <div style={styles.field}>

              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                required
                style={styles.input}
              />

            </div>

            {/* Email */}

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

            {/* Password */}

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
                placeholder="Create a password"
                required
                style={styles.input}
              />

            </div>

            {/* Confirm password */}

            <div style={styles.field}>

              <label style={styles.label}>
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm your password"
                required
                style={styles.input}
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.registerButton,
                opacity:
                  loading ? 0.7 : 1
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}

          <div style={styles.loginSection}>

            <span style={styles.loginText}>
              Already have an account?
            </span>

            <button
              onClick={() =>
                navigate("/login")
              }
              style={styles.loginButton}
            >
              Sign In
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
    marginBottom: "25px"
  },

  logoIcon: {
    width: "52px",
    height: "52px",
    margin:
      "0 auto 12px",
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
    margin:
      "7px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  },

  card: {
    backgroundColor: "#ffffff",
    border:
      "1px solid #e5e7eb",
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
    margin:
      "8px 0 25px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5"
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    padding:
      "12px 14px",
    marginBottom: "20px",
    fontSize: "14px"
  },

  field: {
    marginBottom: "17px"
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
    padding:
      "12px 13px",
    borderRadius: "8px",
    border:
      "1px solid #d1d5db",
    color: "#111827",
    backgroundColor:
      "#ffffff",
    fontSize: "14px",
    outline: "none"
  },

  registerButton: {
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

  loginSection: {
    marginTop: "25px",
    paddingTop: "22px",
    borderTop:
      "1px solid #e5e7eb",
    textAlign: "center"
  },

  loginText: {
    color: "#6b7280",
    fontSize: "14px"
  },

  loginButton: {
    border: "none",
    backgroundColor:
      "transparent",
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

export default Register;