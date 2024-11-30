import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

import Dashboard from './pages/Dashboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={localStorage.getItem('access_token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}/>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
