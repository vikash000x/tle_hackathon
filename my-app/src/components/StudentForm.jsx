import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  cfHandle: "",
};

const StudentForm = ({ onSuccess, editingStudent = null, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone || "",
        cfHandle: editingStudent.cfHandle,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStudent) {
        await axios.put(
          `http://localhost:5000/api/students/${editingStudent._id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/students", formData);
      }

      onSuccess();
      setFormData(initialFormState);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useTheme();

  return (
  
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: theme === "dark" ? "#444" : "#ddd",
        width: "100%",
        maxWidth: "350px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
        {editingStudent ? "✏️ Edit Student" : "➕ Add Student"}
      </h2>

      {["name", "email", "phone", "cfHandle"].map((field) => (
        <div key={field} style={{ marginBottom: "10px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "5px",
              textTransform: "capitalize",
            }}
          >
            {field}
          </label>
          <input
            name={field}
            type="text"
            required={["name", "email", "cfHandle"].includes(field)}
            value={formData[field]}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>
      ))}

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Saving..." : editingStudent ? "Update" : "Add"}
        </button>

        {editingStudent && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: theme === "dark" ? "red" : "green",
              color: theme === "dark" ? "white" : "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>

  
  );
};

export default StudentForm;
