import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import api from "./api";
import Landing from "./components/landing";
import Login from "./components/login";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    api.auth
      .user()
      .then(res => {
        setUser(res.data);
        setLoggedIn(true);
      })
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Landing user={user!} /> : <Login loading={loading} />} />
      </Routes>
    </Router>
  );
}

export default App;
