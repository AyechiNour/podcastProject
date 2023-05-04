import { Routes, Route, useNavigate } from "react-router-dom";

import {  Footer } from "@/widgets/layout";
import routes from "@/routes";
import { useContext, useEffect } from "react";
import LoginContext from "@/context/loginContext";

export function Auth() {
  const { isLoggedIn } = useContext(LoginContext);

  const navigate = useNavigate();
  useEffect(() => {
    // if token exist and liggein is true redirect to dashboard
    if ((localStorage.getItem("token") !== null) && (isLoggedIn)) {
      // The item exists in localStorage
      navigate('/dashboard/profile');
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full">
   
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
      <div className="container absolute bottom-8 left-2/4 z-10 mx-auto -translate-x-2/4 text-white">
        <Footer />
      </div>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
