import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getLivestock,
  getLivestockDetail,
  createLivestock,
  getEvents,
  addEvent,
} from "../api/livestock";

const EVENT_TYPES = [
  "birth",
  "death",
  "sale",
  "purchase",
  "vet_visit",
  "weight_check",
  "quantity_adjustment",
];

const Livestock = () => {
  const { selectedFarm } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = ["owner", "manager"].includes(selectedFarm.role);

  // create form
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("individual");
  const [species, setSpecies] = useState("");
  const [tagId, setTagId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [quantity, setQuantity] = useState("");

  // selected record + detail/events
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState("vet_visit");
  const [eventQtyChange, setEventQtyChange] = useState("");
  const [eventWeight, setEventWeight] = useState("");
  const [eventValue, setEventValue] = useState("");
  const [eventNotes, setEventNotes] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    try {
      const res = await getLivestock(selectedFarm.id);
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load livestock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm.id]);

  const resetForm = () => {
    setType("individual");
    setSpecies("");
    setTagId("");
    setBirthDate("");
    setSex("");
    setQuantity("");
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { type, species };
      if (type === "individual") {
        payload.tagId = tagId || null;
        payload.birthDate = birthDate || null;
        payload.sex = sex || null;
      } else {
        payload.quantity = Number(quantity);
      }
      await createLivestock(selectedFarm.id, payload);
      resetForm();
      loadRecords();
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create livestock record",
      );
    }
  };

  const openRecord = async (record) => {
    setError("");
    try {
      const detail = await getLivestockDetail(selectedFarm.id, record.id);
      setSelected(detail);
      const evts = await getEvents(selectedFarm.id, record.id);
      setEvents(evts);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load record");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addEvent(selectedFarm.id, selected.id, {
        eventType,
        quantityChange: eventQtyChange ? Number(eventQtyChange) : null,
        weight: eventWeight ? Number(eventWeight) : null,
        value: eventValue ? Number(eventValue) : null,
        notes: eventNotes,
      });
      setEventQtyChange("");
      setEventWeight("");
      setEventValue("");
      setEventNotes("");
      openRecord(selected); // refresh current_quantity + events
    } catch (err) {
      setError(err.response?.data?.error || "Failed to record event");
    }
  };

  if (loading) return <p>Loading livestock...</p>;

  return (
    <div className="page">
      <h1>Livestock — {selectedFarm.name}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Type</th>
            <th>Species</th>
            <th>Tag / Quantity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.type}</td>
              <td>{r.species}</td>
              <td>
                {r.type === "individual" ? (r.tag_id ?? "-") : r.quantity}
              </td>
              <td>
                <button onClick={() => openRecord(r)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && <p>No livestock records yet.</p>}

      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)}>+ Add Livestock</button>
      )}

      {canManage && showForm && (
        <form onSubmit={handleCreate}>
          <h3>New Livestock Record</h3>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="individual">Individual (tagged animal)</option>
            <option value="batch">Batch (group)</option>
          </select>
          <input
            type="text"
            placeholder="Species (e.g. cattle, chicken)"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          />

          {type === "individual" ? (
            <>
              <input
                type="text"
                placeholder="Tag ID (e.g. COW-014)"
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
              />
              <input
                type="date"
                placeholder="Birth date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="">Sex (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </>
          ) : (
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          )}

          <button type="submit">Create</button>
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {selected && (
        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #ccc",
            paddingTop: "1rem",
          }}
        >
          <h2>
            {selected.species}{" "}
            {selected.type === "individual"
              ? `— ${selected.tag_id ?? "no tag"}`
              : ""}
          </h2>
          {selected.type === "batch" && (
            <p>Current quantity: {selected.current_quantity}</p>
          )}
          {selected.type === "individual" && (
            <p>
              Sex: {selected.sex ?? "-"} | Born: {selected.birth_date ?? "-"}
            </p>
          )}

          <form onSubmit={handleAddEvent}>
            <h3>Record Event</h3>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
            {selected.type === "batch" && (
              <input
                type="number"
                placeholder="Quantity change (e.g. -2 or 10)"
                value={eventQtyChange}
                onChange={(e) => setEventQtyChange(e.target.value)}
              />
            )}
            <input
              type="number"
              placeholder="Weight (optional)"
              value={eventWeight}
              onChange={(e) => setEventWeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="Value/price (optional)"
              value={eventValue}
              onChange={(e) => setEventValue(e.target.value)}
            />
            <input
              type="text"
              placeholder="Notes"
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
            />
            <button type="submit">Record</button>
          </form>

          <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Qty Change</th>
                <th>Weight</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{new Date(ev.event_date).toLocaleDateString()}</td>
                  <td>{ev.event_type}</td>
                  <td>{ev.quantity_change ?? "-"}</td>
                  <td>{ev.weight ?? "-"}</td>
                  <td>{ev.value ?? "-"}</td>
                  <td>{ev.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Livestock;
