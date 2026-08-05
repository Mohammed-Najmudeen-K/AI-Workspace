import { Link, useLocation } from "react-router-dom";

type AppNavProps = {
  variant?: "sidebar" | "page";
};

function AppNav({ variant = "page" }: AppNavProps) {
  const location = useLocation();

  return (
    <nav className={variant === "sidebar" ? "sidebar-nav" : "page-nav"}>
      <Link
        to="/"
        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
      >
        Chat
      </Link>
      <Link
        to="/documents"
        className={`nav-link ${location.pathname === "/documents" ? "active" : ""}`}
      >
        Knowledge base
      </Link>
    </nav>
  );
}

export default AppNav;
