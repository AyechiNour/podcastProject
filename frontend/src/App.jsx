import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import React, { useEffect, useState } from "react";
import LoginContext from "./context/loginContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.addEventListener('storage', function (event) {
      if (event.storageArea === localStorage) {
        if (event.key == "token") {
           if (event.newValue === null || event.newValue.length === 0) {
            setIsLoggedIn(false)
            localStorage.removeItem('token');
            navigate('/auth/sign-in');
            window.location.reload();
          }
        }
      }
    });
  }, [])


  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </LoginContext.Provider>

  );
}

export default App;
