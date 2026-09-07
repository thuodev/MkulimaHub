import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getFields,
  createField,
  updateField,
  deleteField,
} from "../api/fields";

const Fields = () => {
  const { selectedFarm } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState("acres");
  const [currentCrop, setCurrentCrop] = useState("");

  const canManage = ["owner", "manager"].includes(selectedFarm.role);

  const loadFields = async () => {
    setLoading(true);
    try {
      const res = await getFields(selectedFarm.id);
      setFields(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm.id]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSize("");
    setSizeUnit("acres");
    setCurrentCrop("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      name,
      size: size ? Number(size) : null,
      sizeUnit,
      currentCrop,
    };
    try {
      if (editingId) {
        await updateField(selectedFarm.id, editingId, payload);
      } else {
        await createField(selectedFarm.id, payload);
      }
      resetForm();
      loadFields();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save field");
    }
  };

  const handleEdit = (field) => {
    setEditingId(field.id);
    setName(field.name);
    setSize(field.size ?? "");
    setSizeUnit(field.size_unit ?? "acres");
    setCurrentCrop(field.current_crop ?? "");
    setShowForm(true);
  };

  const handleDelete = async (fieldId) => {
    if (!confirm("Delete this field?")) return;
    try {
      await deleteField(selectedFarm.id, fieldId);
      loadFields();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete field");
    }
  };

  if (loading) return <p>Loading fields...</p>;

  return (
    <div className="page">
      <h1>Fields — {selectedFarm.name}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Crop</th>
            {canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td>{field.name}</td>
              <td>
                {field.size ?? "-"} {field.size_unit}
              </td>
              <td>{field.current_crop ?? "-"}</td>
              {canManage && (
                <td>
                  <button onClick={() => handleEdit(field)}>Edit</button>
                  <button onClick={() => handleDelete(field.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {fields.length === 0 && <p>No fields yet.</p>}

      {canManage && !showForm && (
        <button onClick={() => setShowForm(true)}>+ Add Field</button>
      )}

      {canManage && showForm && (
        <form onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Field" : "New Field"}</h3>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <select
            value={sizeUnit}
            onChange={(e) => setSizeUnit(e.target.value)}
          >
            <option value="acres">acres</option>
            <option value="hectares">hectares</option>
          </select>
          <input
            type="text"
            placeholder="Current crop"
            value={currentCrop}
            onChange={(e) => setCurrentCrop(e.target.value)}
          />
          <button type="submit">{editingId ? "Save" : "Create"}</button>
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Fields;
