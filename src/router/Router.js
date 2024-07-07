import React from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import { APP_ROUTES } from "./Route.js";
import Course from "../components/Course/Course";
import Login from "../components/Login/Login";
import Tests from "../components/Tests/Tests";
import Messages from "../components/Messages/Messages";
// import Mentor from "../components/Curator/Mentor.tsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("@token");
  const isTokenAvailable = token != null && token !== "";

  let location = useLocation();

  if (!isTokenAvailable) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return children;
  }
}

function Router() {
  const role = localStorage.getItem("@role");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={APP_ROUTES.LOGIN} />} />
        <Route path={APP_ROUTES.LOGIN} element={<Login />} />
        <Route
          path={APP_ROUTES.COURSE}
          element={
            <RequireAuth>
              <Course />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.TESTS}
          element={
            <RequireAuth>
              <Tests />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.MESSAGES}
          element={
            <RequireAuth>
              <Messages />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.CHAT}
          element={
            <RequireAuth>
              <Messages />
            </RequireAuth>
          }
        />
        {/* <Route
          path={APP_ROUTES.FINANCE}
          element={
            <RequireAuth>
              <Tests />
            </RequireAuth>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
