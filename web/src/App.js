import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { useAuthStore } from "./state/stores";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ChangeForgotPassword from "./pages/ChangeForgotPassword";
import ComponentLibrary from "./pages/ComponentLibrary";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const authState = useAuthStore((state) => state.auth);

  useEffect(() => {
    if (authState.token) setAuthenticated(true);
  }, [authState]);

  useEffect(() => {}, []);

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/" element={<Home />} />
      ) : (
        <Route path="/" element={<Login />} />
      )}
      <Route path="/settings" element={<Settings />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/change-forgot-password"
        element={<ChangeForgotPassword />}
      />
      <Route path="/component-library" element={<ComponentLibrary />} />
    </Routes>
  );
}

export default App;
