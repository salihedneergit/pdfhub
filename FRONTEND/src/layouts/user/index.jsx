import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import { FiMenu } from "react-icons/fi";

export default function User(props) {
  const { ...rest } = props;
  const location = useLocation();

  // Closed by default on screens < 1500px
  const [open, setOpen] = React.useState(window.innerWidth >= 1300); 
  const [currentRoute, setCurrentRoute] = React.useState("User Dashboard");

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1300) {
        setOpen(true);  // Automatically open on >=1500px
      } else {
        setOpen(false); // Closed on <1500px (mobile, tablet, etc.)
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  // -------------------------
  // Functions remain the same
  // -------------------------
  const getActiveRoute = (routes) => {
    let activeRoute = "User Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes
      .filter((prop) => prop.layout === "/user")
      .map((prop, key) => (
        <Route path={`/${prop.path}`} element={prop.component} key={key} />
      ));
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        layout="/user"
        className="transition-transform duration-100 ease-in-out"
      />

      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* 
          2) Changed `xl:ml-[313px]` to `2xl:ml-[313px]` 
             so the main content margin only applies at 1500px+ 
        */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 2xl:ml-[313px]`}
        >
          <div className="h-full">
            {/* 
              1) Changed `md:hidden` to `2xl:hidden` 
                 so the menu button stays visible until 1500px 
            */}
            <div className="flex items-center justify-between p-4 2xl:hidden">
              <button
                className="text-navy-700 dark:text-white"
                onClick={() => setOpen(!open)}
              >
                <FiMenu size={24} />
              </button>
              <Navbar
                onOpenSidenav={() => setOpen(true)}
                logoText={"Notes Daddy"}
                brandText={currentRoute}
                secondary={getActiveNavbar(routes)}
                {...rest}
              />
            </div>

            {/* Routes */}
            <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/user/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/user/dashboard" replace />}
                />
              </Routes>
            </div>

            {/* Footer */}
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
