import React, { useEffect, useState } from "react";
import axios from "axios";
import { RatingChart } from "./Graph/RatingChart";
import { BarRatingBucket } from "./Graph/BarRatingBucket";
import { HeatMap } from "./Graph/HeatMap";
import { useTheme } from "../context/ThemeContext";
import { DarkModeToggle } from "./DarkModeToggle";

const ProfileDrawer = ({ studentId, isOpen, onClose }) => {
  const [contestData, setContestData] = useState([]);
  const [problemStats, setProblemStats] = useState({});
  const [contestRange, setContestRange] = useState(30);
  const [problemRange, setProblemRange] = useState(7);

   const [students, setStudents] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      const [contestRes, problemRes, studentRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/students/${studentId}/contest-data?range=${contestRange}`),
        axios.get(`http://localhost:5000/api/students/${studentId}/problem-stats?range=${problemRange}`),
        axios.get(`http://localhost:5000/api/students/${studentId}`)
      ]);

      setContestData(contestRes.data.contests || []);
      setProblemStats(problemRes.data || {});
      setStudents(studentRes.data || []);
      //setStudentName(studentRes.data.name || "Student");
    };

    fetchData();
  }, [studentId, contestRange, problemRange]);

   console.log(students);

   const btn = students.emailOptOut == false ? "close reminding" : "start reminding";
  const handleReminderToggle = async () => {
    try {
      const updatedStudent = {
        ...students,
        emailOptOut: !students.emailOptOut,
        };
        await axios.put(`http://localhost:5000/api/students/${students._id}`, updatedStudent);
        setStudents(updatedStudent);
    } catch (error) {
        console.error("Failed to update reminder setting:", error);
    }
    };


//   const toggleTheme = () => {
//     const newTheme = theme === "dark" ? "light" : "dark";
//     localStorage.setItem("theme", newTheme);
//     setTheme(newTheme);
//   };

  if (!isOpen) return null;

  const isDark = theme === "dark";
  const colors = isDark
    ? {
        bg: "#1a202c",
        text: "#f7fafc",
        accent: "#90cdf4",
        border: "#2d3748",
        tableBg: "#2d3748",
      }
    : {
        bg: "#f8fafc",
        text: "#1a202c",
        accent: "#2b6cb0",
        border: "#cbd5e0",
        tableBg: "#edf2f7",
      };

  return (
    <div style={{ ...styles.overlay, backgroundColor: isDark ? "#00000099" : "#00000055" }}>
      <div style={{ ...styles.modal, backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.border}` }}>
        <div style={styles.header}>
          <h2 style={{ fontSize: "22px", color: colors.accent }}>👋 Welcome to  {students.name} Performance Dashboard</h2>
          <p style={{ fontSize: "14px", marginTop: "-4px" }}>Monitor, analyze, and track Codeforces progress — all in one place.</p>
          <div style={styles.actionRow}>
            <DarkModeToggle />
            <button onClick={onClose} style={styles.closeButton}>❌</button>
          </div>
        </div>

        {/* Contest History */}
        <h3 style={{ ...styles.subHeading, color: colors.accent }}>📈 Contest History</h3>
        <select style={{ ...styles.select, borderColor: colors.border }} value={contestRange} onChange={e => setContestRange(Number(e.target.value))}>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={365}>Last 365 Days</option>
        </select>

        {contestData.length === 0 ? (
  <div style={styles.emptyMessage}>
    <h3 style={styles.emptyTitle}>😕 Oops! No Contest Activity Found</h3>
    <p style={styles.emptySubtitle}>
      It looks like there haven't been any contests participated in the selected timeframe. Try selecting a different range or encourage the student to participate in a contest!
    </p>
  </div>
) : (
  <>
    <RatingChart
      data={contestData.map(c => ({
        date: new Date(c.date).toLocaleDateString(),
        rating: c.newRating
      }))}
    />

    <div style={styles.tableWrapper}>
      <table style={{ ...styles.table, backgroundColor: colors.tableBg }}>
        <thead>
          <tr>
            <th>Contest</th>
            <th>Rank</th>
            <th>Change</th>
            <th>New Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {contestData.map((c, i) => (
           <tr key={i} style={{...styles.perRow, backgroundColor: isDark ? "#1a202c" : "#f8fafc", text: isDark ? "white" : "black" }}>
  <td style={styles.cell}>{c.contestName}</td>
  <td style={styles.cell}>{c.rank}</td>
  <td style={{ ...styles.cell, color: c.ratingChange >= 0 ? "#16a34a" : "#dc2626" }}>
    {c.ratingChange}
  </td>
  <td style={styles.cell}>{c.newRating}</td>
  <td style={styles.cell}>{new Date(c.date).toLocaleDateString()}</td>
</tr>

          ))}
        </tbody>
      </table>
    </div>
  </>
)}


        {/* Problem Stats */}
        <h3 style={{ ...styles.subHeading, color: colors.accent }}>🧠 Problem Solving Data</h3>
        <select style={{ ...styles.select, borderColor: colors.border }} value={problemRange} onChange={e => setProblemRange(Number(e.target.value))}>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>

        <div style={styles.statsGrid}>
          <div><strong>Total Solved:</strong> {problemStats.totalSolved || 0}</div>
          <div><strong>Average Rating:</strong> {problemStats.avgRating || 0}</div>
          <div><strong>Avg/Day:</strong> {problemStats.avgPerDay || 0}</div>
          <div><strong>ReminderCount:</strong> { students.reminderCount || 0}</div>
          <div>
            <strong>Most Difficult:</strong><br />
            <a style={styles.link} href={problemStats.mostDifficult?.link} target="_blank" rel="noreferrer">
              {problemStats.mostDifficult?.name} ({problemStats.mostDifficult?.rating})
            </a>
          </div>
          <button
  onClick={handleReminderToggle}
  style={{
    padding: "8px 16px",
    backgroundColor: students.emailOptOut ? "#4caf50" : "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  }}
>
  {students.emailOptOut ? "✨ Start Reminders" : "Stop Reminding"}
</button>

        </div>

        <BarRatingBucket data={problemStats.ratingBuckets || {}} />

        <h4 style={styles.subHeading}>🗓️ Submission Heatmap</h4>
        <HeatMap values={problemStats.submissionHeatmap || []} range={problemRange} />

      </div>
    </div>
  );
};



const styles = {

perRow: {
 //backgroundColor: isDark ? "#00000099" : "#00000055",
  transition: "background-color 0.3s ease",
  borderBottom: "1px solid #e5e7eb",
  cursor: "default",
  textAlign: "center",
  fontSize: "14px",
  lineHeight: "1.6",
   //border: "1px solid black",
},

cell: {
  padding: "10px 12px",
  fontWeight: 500,
 // color: "#374151", // gray-700
},


  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    width: "95%",
    maxWidth: "800px",
    maxHeight: "95vh",
    overflowY: "auto",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  header: {
    marginBottom: "15px",
  },
 closeButton: {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#ef4444', // Tailwind's red-500
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
},

  themeButton: {
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#4a5568",
    border: "1px solid",
    marginRight: "10px"
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px"
  },
  subHeading: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "8px",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "10px"
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "10px",
    height : "300px",
   
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
   //  border: "1px solid black"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px",
    marginBottom: "10px"
  },
  link: {
    color: "#4299e1",
    textDecoration: "underline",
    wordBreak: "break-word"
  },
  emptyMessage: {
  textAlign: 'center',
  padding: '40px 20px',
  backgroundColor: '#fef3c7', // warm light yellow
  borderRadius: '12px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  color: '#92400e',
},

emptyTitle: {
  fontSize: '20px',
  fontWeight: '700',
  marginBottom: '10px',
},

emptySubtitle: {
  fontSize: '14px',
  color: '#92400e',
}

};

export default ProfileDrawer;
