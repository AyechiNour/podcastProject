import { Routes, Route, useNavigate } from "react-router-dom";

import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";
import { useContext, useEffect } from "react";
import LoginContext from "@/context/loginContext";

export function Dashboard() {

  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if token not exist(nrajaa false) or loggein is false redirect to login
    if (localStorage.getItem("token") == null || !isLoggedIn) {
      // The item exists in localStorage
      setIsLoggedIn(false)
      localStorage.removeItem("token");
      navigate('/auth/sign-in');
    }
  }, [])

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />

        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
