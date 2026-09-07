import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getInputs,
  getCategories,
  createInput,
  getTransactions,
  addTransaction,
} from "../api/inputs";

const Inputs = () => {
  const { selectedFarm } = useAuth();
  const [inputs, setInputs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = ["owner", "manager"].includes(selectedFarm.role);

  // create-input form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // selected input + its ledger
  const [selectedInput, setSelectedInput] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [txType, setTxType] = useState("in");
  const [txQuantity, setTxQuantity] = useState("");
  const [txCost, setTxCost] = useState("");
  const [txNotes, setTxNotes] = useState("");

  const loadInputs = async () => {
    setLoading(true);
    try {
      const res = await getInputs(selectedFarm.id);
      setInputs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load inputs");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getCategories(selectedFarm.id);
      setCategories(cats);
    } catch {
      // categories are non-critical, fail silently
    }
  };

  useEffect(() => {
    loadInputs();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm.id]);

  const handleCreateInput = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createInput(selectedFarm.id, {
        name,
        unitOfMeasure,
        categoryId: categoryId ? Number(categoryId) : null,
      });
      setName("");
      setUnitOfMeasure("");
      setCategoryId("");
      setShowForm(false);
      loadInputs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create input");
    }
  };

  const openLedger = async (input) => {
    setSelectedInput(input);
    setError("");
    try {
      const res = await getTransactions(selectedFarm.id, input.id);
      setBalance(res.balance);
      setTransactions(res.transactions);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load transactions");
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addTransaction(selectedFarm.id, selectedInput.id, {
        type: txType,
        quantity: Number(txQuantity),
        cost: txCost ? Number(txCost) : null,
        notes: txNotes,
      });
      setTxQuantity("");
      setTxCost("");
      setTxNotes("");
      openLedger(selectedInput); // refresh balance + list
    } catch (err) {
      setError(err.response?.data?.error || "Failed to record transaction");
    }
  };

  if (loading) return <p>Loading inputs...</p>;

  return (
    <div className="page">
      <h1>Inputs — {selectedFarm.name}</h1>
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
          {inputs.map((input) => (
            <tr key={input.id}>
              <td>{input.name}</td>
              <td>{input.category_name ?? "-"}</td>
              <td>{input.unit_of_measure}</td>
              <td>
                <button onClick={() => openLedger(input)}>
                  View Transactions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {inputs.length === 0 && <p>No inputs yet.</p>}

      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)}>+ Add Input</button>
      )}

      {canManage && showForm && (
        <form onSubmit={handleCreateInput}>
          <h3>New Input</h3>
          <input
            type="text"
            placeholder="Name (e.g. DAP Fertilizer)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Unit (e.g. kg)"
            value={unitOfMeasure}
            onChange={(e) => setUnitOfMeasure(e.target.value)}
            required
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit">Create</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {selectedInput && (
        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #ccc",
            paddingTop: "1rem",
          }}
        >
          <h2>
            {selectedInput.name} — Balance: {balance}{" "}
            {selectedInput.unit_of_measure}
          </h2>

          <form onSubmit={handleAddTransaction}>
            <select value={txType} onChange={(e) => setTxType(e.target.value)}>
              <option value="in">In (purchase)</option>
              <option value="out">Out (usage)</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={txQuantity}
              onChange={(e) => setTxQuantity(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Cost (optional)"
              value={txCost}
              onChange={(e) => setTxCost(e.target.value)}
            />
            <input
              type="text"
              placeholder="Notes"
              value={txNotes}
              onChange={(e) => setTxNotes(e.target.value)}
            />
            <button type="submit">Record</button>
          </form>

          <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                  <td>{tx.type}</td>
                  <td>{tx.quantity}</td>
                  <td>{tx.cost ?? "-"}</td>
                  <td>{tx.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inputs;
