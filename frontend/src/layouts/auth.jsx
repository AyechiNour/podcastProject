import { Routes, Route, useNavigate } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";
import { useContext, useEffect } from "react";
import LoginContext from "@/context/loginContext";

export function Auth() {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "sign out",
      path: "/auth/sign-in",
      icon: ArrowRightOnRectangleIcon,
    },
  ];
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
      {/* <div className="container relative z-40 mx-auto p-4">
        <Navbar routes={navbarRoutes} />
      </div> */}
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
