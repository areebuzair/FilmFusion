import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import { Register } from "../pages/SignUp/register";
import EmailVerifier from "../pages/EmailVerifier/EmailVerifier";
import Logout from "../pages/Logout";
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import MovieList from '../components/MovieList';
import Home from "../components/Home";


import Test from "../components/test";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Test />,
        },
        {
          path: "/logout",
          element: <Logout/>,
        },
        {
          path: "/dashboard",
          element: <Dashboard />
        },

      
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/signup",
      element: <Register/>,
    },
    {
      path: "/verify-registration",
      element: <EmailVerifier/>,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
