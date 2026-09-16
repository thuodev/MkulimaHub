import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="page">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Send reset link</button>
      </form>
      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
