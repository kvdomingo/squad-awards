import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import api from "./api";
import Landing from "./components/landing";
import Login from "./components/login";
import GlobalNotification from "./components/utils/GlobalNotification";
import { GlobalNotificationState, User } from "./types";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [globalNotification, setGlobalNotification] = useState<GlobalNotificationState>({
    visible: false,
    severity: "info",
    message: "",
  });

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
        <Route
          path="/"
          element={
            loggedIn ? (
              <Landing user={user!} setUser={setUser} setGlobalNotification={setGlobalNotification} />
            ) : (
              <Login loading={loading} />
            )
          }
        />
      </Routes>
      <GlobalNotification
        {...globalNotification}
        onClose={() => setGlobalNotification(prev => ({ ...prev, visible: false }))}
      />
    </Router>
  );
}

export default App;
