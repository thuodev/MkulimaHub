import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/auth";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="page">
      <h1>Reset Password</h1>
      {!message ? (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Reset password</button>
        </form>
      ) : (
        <p>{message} Redirecting to login…</p>
      )}
      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
