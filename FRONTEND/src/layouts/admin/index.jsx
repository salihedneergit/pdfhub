import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import { FiMenu } from "react-icons/fi";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();

  const [open, setOpen] = React.useState(window.innerWidth >= 1300);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    // Adjust sidebar visibility on resize
    const handleResize = () => {
      if (window.innerWidth >= 1300) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // Update the active route based on location
    getActiveRoute(routes);
  }, [location.pathname]);

  // ---------------------------------
  // All functions remain UNCHANGED
  // ---------------------------------
  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
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
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    // Only render routes specific to admin layout
    return routes
      .filter((prop) => prop.layout === "/admin")
      .map((prop, key) => (
        <Route path={`/${prop.path}`} element={prop.component} key={key} />
      ));
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} layout="/admin" />

      {/* Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/*
          Changed from `xl:ml-[313px]` to `2xl:ml-[313px]`
          so the main content shifts only at 1536px+
        */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 2xl:ml-[313px]`}
        >
          <div className="h-full">
            {/*
              Changed from `md:hidden` to `2xl:hidden`
              so the hamburger menu is visible on all screens < 1536px
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
                logoText={""}
                brandText={currentRoute}
                secondary={getActiveNavbar(routes)}
                {...rest}
              />
            </div>

            {/* Routes */}
            <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                {/* Redirect to a default route */}
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/admin/dashboard" replace />}
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
