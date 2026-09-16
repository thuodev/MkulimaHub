import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getMembers,
  createEmployee,
  addExistingMember,
  removeMember,
} from "../api/team";

const Team = () => {
  const { selectedFarm } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOwner = selectedFarm.role === "owner";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("worker");

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers(selectedFarm.id);
      setMembers(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm.id]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createEmployee(selectedFarm.id, { name, email, role });
      setSuccess(`${name} added — login details sent to ${email}`);
      setName("");
      setEmail("");
      setRole("worker");
      loadMembers();
    } catch (err) {
      if (err.response?.status === 409) {
        // account already exists — add them as an existing member instead
        try {
          await addExistingMember(selectedFarm.id, { email, role });
          setSuccess(`${email} added back to the farm as ${role}`);
          setName("");
          setEmail("");
          setRole("worker");
          loadMembers();
        } catch (fallbackErr) {
          setError(fallbackErr.response?.data?.error || "Failed to add member");
        }
      } else {
        setError(err.response?.data?.error || "Failed to add employee");
      }
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Remove this member from the farm?")) return;
    try {
      await removeMember(selectedFarm.id, userId);
      loadMembers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove member");
    }
  };

  if (loading) return <p>Loading team...</p>;

  return (
    <div className="page">
      <h1>Team — {selectedFarm.name}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p>{success}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {isOwner && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.user_id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.role}</td>
              {isOwner && (
                <td>
                  {m.role !== "owner" && (
                    <button onClick={() => handleRemove(m.user_id)}>
                      Remove
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isOwner && (
        <form onSubmit={handleAddEmployee}>
          <h3>Add a worker or manager</h3>
          <p>
            They'll get an account and login details emailed to them
            automatically.
          </p>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="worker">Worker</option>
            <option value="manager">Manager</option>
          </select>
          <button type="submit">Add & send login details</button>
        </form>
      )}
    </div>
  );
};

export default Team;
