import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from './components/AuthRoutes'
import './App.css'
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard'


function App() {
  return (
    <div className='base-container'>
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<AuthRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
      </Router>
    </div>
  )
}

export default App

