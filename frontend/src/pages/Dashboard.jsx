import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../api/dashboard";

const Dashboard = () => {
  const { selectedFarm, user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDashboard(selectedFarm.id);
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedFarm.id]);

  return (
    <div className="page">
      <h1>{selectedFarm.name}</h1>
      <p>
        Logged in as {user.name} — role: {selectedFarm.role}
      </p>
      <nav>
        <Link to="/fields">Fields</Link> | <Link to="/inputs">Inputs</Link> |{" "}
        <Link to="/stock">Stock</Link> | <Link to="/livestock">Livestock</Link>{" "}
        | <Link to="/farms">Switch Farm</Link>
      </nav>
      <button onClick={logout}>Logout</button>

      {loading && <p>Loading summary...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div style={{ marginTop: "2rem" }}>
          <section>
            <h2>Fields</h2>
            <p>
              {summary.fields.count} fields, {summary.fields.totalSize} total
              size
            </p>
          </section>

          <section>
            <h2>Inputs</h2>
            {summary.inputs.length === 0 ? (
              <p>No inputs recorded.</p>
            ) : (
              <table border="1" cellPadding="6">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.inputs.map((i) => (
                    <tr key={i.id}>
                      <td>{i.name}</td>
                      <td>
                        {i.balance} {i.unit_of_measure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2>Stock</h2>
            {summary.stock.length === 0 ? (
              <p>No stock recorded.</p>
            ) : (
              <table border="1" cellPadding="6">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.stock.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>
                        {s.balance} {s.unit_of_measure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2>Livestock</h2>
            <p>{summary.livestock.totalRecords} records</p>
            <ul>
              {Object.entries(summary.livestock.bySpecies).map(
                ([species, count]) => (
                  <li key={species}>
                    {species}: {count}
                  </li>
                ),
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
