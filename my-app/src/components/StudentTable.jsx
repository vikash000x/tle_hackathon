import { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import ProfileDrawer from "./ProfileDrawer";
import StudentForm from "./StudentForm";
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "../context/ThemeContext";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
 
  const { theme } = useTheme(); // <-- get theme from context



  const fetchStudents = async () => {
    const res = await axios.get("https://tle-hackathon.onrender.com/api/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`https://tle-hackathon.onrender.com/api/students/${id}`);
    fetchStudents();
  };

  const containerStyle = {
    padding: "20px",
    background: theme === "dark" ? "#1a202c" : "#f9f9f9",
    color: theme === "dark" ? "white" : "black",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
  };

  const buttonStyle = {
    padding: "8px 16px",
    margin: "0 5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const navBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  };

 const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent dark background
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  backdropFilter: "blur(4px)",
};

const modalContent = {
  backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  position: "relative",
  color: theme === "dark" ? "white" : "black",
};

const footer  = {
  backgroundColor: "#1f2937",
  color: "#ffffff",
  textAlign: "center",
  paddingBottom : "10px",
  // padding: "30px 20px",
  marginBottom: "50px",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)"
}




  return (
    <div style={containerStyle}>
        <div style={footer}>
  <h2>Crafted with 💻 by Vikash Sinha</h2>
  <div className="social-icons">
    <a href="https://github.com/vikash000x" target="_blank" rel="noreferrer">
      <FaGithub size={28} style={{color: "red"}} />
    </a>
    <a href="https://www.linkedin.com/in/vikash-sinha-215000259/" target="_blank" rel="noreferrer">
      <FaLinkedin size={28} style={{color: "white", paddingLeft: "20px"}}/>
    </a>
    <a href="mailto:vikashsinha045@gmail.com">
      <HiOutlineMail size={28}  style={{color: "yellow" , paddingLeft: "20px"}} />
    </a>
  </div>
</div>
      <div style={navBarStyle}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#4caf50",
              color: "white",
            }}
            onClick={() => setShowForm(true)}
          >
            ➕ Add Student
          </button>
          <CSVLink
            data={students}
            filename="students.csv"
            style={{
              ...buttonStyle,
              backgroundColor: "#2196f3",
              color: "white",
              textDecoration: "none",
            }}
          >
            📥 Download CSV
          </CSVLink>
        </div>
        <DarkModeToggle />
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: theme === "dark" ? "#444" : "#ddd" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>CF Handle</th>
            <th>Rating</th>
            <th>Max</th>
            <th>Sync</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s._id}
              style={{
                textAlign: "center",
                borderTop: "1px solid gray",
                backgroundColor: theme === "dark" ? "#222" : "#fff",
              }}
            >
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.cfHandle}</td>
              <td>{s.currentRating}</td>
              <td>{s.maxRating}</td>
              <td>{new Date(s.lastSyncedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => setSelected(s)}>👁 View</button>
                <button
                  onClick={() => {
                    setEditingStudent(s);
                    setShowForm(true);
                  }}
                  style={{ marginLeft: 5, color: "#f39c12" }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  style={{ marginLeft: 5, color: "#e74c3c" }}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
         <div style={modalOverlay}>
          <div style={modalContent}>
        <ProfileDrawer  studentId={selected._id}
    isOpen={!!selected}
    onClose={() => setSelected(null)} />
    </div>
    </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <button
              style={{
                float: "right",
                border: "none",
                background: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: theme === "dark" ? "white" : "black",
              }}
              onClick={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
            >
              ❌
            </button>
            <StudentForm
              editingStudent={editingStudent}
              onSuccess={() => {
                fetchStudents();
                setShowForm(false);
                setEditingStudent(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
            />
          </div>
        </div>
      )}

    
    </div>
  );

            


};




export default StudentTable;
