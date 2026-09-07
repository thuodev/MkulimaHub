import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFarms, createFarm } from "../api/farms";
import { useAuth } from "../context/AuthContext";

const FarmSelect = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [totalSize, setTotalSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState("acres");

  const { setSelectedFarm, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const data = await getFarms();
      setFarms(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const handlePick = (farm) => {
    setSelectedFarm(farm);
    navigate("/dashboard");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const farm = await createFarm({
        name,
        location,
        totalSize: totalSize ? Number(totalSize) : null,
        sizeUnit,
      });
      setSelectedFarm({ ...farm, role: "owner" });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create farm");
    }
  };

  if (loading) return <p>Loading farms...</p>;

  return (
    <div className="page">
      <h1>Your Farms</h1>
      <button onClick={logout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {farms.length === 0 && !showCreateForm && (
        <p>You don't belong to any farms yet.</p>
      )}

      {farms.length > 0 && (
        <ul>
          {farms.map((farm) => (
            <li key={farm.id}>
              <button onClick={() => handlePick(farm)}>
                {farm.name} — {farm.role} ({farm.total_size ?? "?"}{" "}
                {farm.size_unit})
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showCreateForm ? (
        <button onClick={() => setShowCreateForm(true)}>
          + Create a new farm
        </button>
      ) : (
        <form onSubmit={handleCreate}>
          <h3>New Farm</h3>
          <input
            type="text"
            placeholder="Farm name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Total size"
            value={totalSize}
            onChange={(e) => setTotalSize(e.target.value)}
          />
          <select
            value={sizeUnit}
            onChange={(e) => setSizeUnit(e.target.value)}
          >
            <option value="acres">acres</option>
            <option value="hectares">hectares</option>
          </select>
          <button type="submit">Create Farm</button>
          <button type="button" onClick={() => setShowCreateForm(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default FarmSelect;
