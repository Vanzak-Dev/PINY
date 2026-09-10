import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    const routeObserver = window.setInterval(updatePathname, 100);
    window.addEventListener("popstate", updatePathname);
    return () => {
      window.clearInterval(routeObserver);
      window.removeEventListener("popstate", updatePathname);
    };
  }, []);

  return pathname.startsWith("/admin") ? <AdminPage /> : <Home />;
}
