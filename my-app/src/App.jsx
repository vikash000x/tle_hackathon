import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ThemeProvider } from "./context/ThemeContext";
import StudentTable from './components/StudentTable';

function App() {
 

  return (
     <ThemeProvider>
    <>
    
    <StudentTable />
   
    </>
    </ThemeProvider>
  )
}

export default App
