import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getStockItems,
  createStockItem,
  getMovements,
  addMovement,
} from "../api/stock";

const Stock = () => {
  const { selectedFarm } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = ["owner", "manager"].includes(selectedFarm.role);

  // create-item form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");

  // selected item + its ledger
  const [selectedItem, setSelectedItem] = useState(null);
  const [balance, setBalance] = useState(0);
  const [movements, setMovements] = useState([]);
  const [movType, setMovType] = useState("in");
  const [movQuantity, setMovQuantity] = useState("");
  const [movReason, setMovReason] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await getStockItems(selectedFarm.id);
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stock items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm.id]);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createStockItem(selectedFarm.id, { name, category, unitOfMeasure });
      setName("");
      setCategory("");
      setUnitOfMeasure("");
      setShowForm(false);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create stock item");
    }
  };

  const openLedger = async (item) => {
    setSelectedItem(item);
    setError("");
    try {
      const res = await getMovements(selectedFarm.id, item.id);
      setBalance(res.balance);
      setMovements(res.movements);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load movements");
    }
  };

  const handleAddMovement = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addMovement(selectedFarm.id, selectedItem.id, {
        type: movType,
        quantity: Number(movQuantity),
        reason: movReason,
      });
      setMovQuantity("");
      setMovReason("");
      openLedger(selectedItem);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to record movement");
    }
  };

  if (loading) return <p>Loading stock...</p>;

  return (
    <div className="page">
      <h1>Stock — {selectedFarm.name}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Ledger</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category ?? "-"}</td>
              <td>{item.unit_of_measure}</td>
              <td>
                <button onClick={() => openLedger(item)}>View Movements</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && <p>No stock items yet.</p>}

      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)}>+ Add Stock Item</button>
      )}

      {canManage && showForm && (
        <form onSubmit={handleCreateItem}>
          <h3>New Stock Item</h3>
          <input
            type="text"
            placeholder="Name (e.g. Baling Twine)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Unit (e.g. rolls)"
            value={unitOfMeasure}
            onChange={(e) => setUnitOfMeasure(e.target.value)}
            required
          />
          <button type="submit">Create</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {selectedItem && (
        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #ccc",
            paddingTop: "1rem",
          }}
        >
          <h2>
            {selectedItem.name} — Balance: {balance}{" "}
            {selectedItem.unit_of_measure}
          </h2>

          <form onSubmit={handleAddMovement}>
            <select
              value={movType}
              onChange={(e) => setMovType(e.target.value)}
            >
              <option value="in">In</option>
              <option value="out">Out</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={movQuantity}
              onChange={(e) => setMovQuantity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Reason"
              value={movReason}
              onChange={(e) => setMovReason(e.target.value)}
            />
            <button type="submit">Record</button>
          </form>

          <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov) => (
                <tr key={mov.id}>
                  <td>{new Date(mov.movement_date).toLocaleDateString()}</td>
                  <td>{mov.type}</td>
                  <td>{mov.quantity}</td>
                  <td>{mov.reason ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stock;
