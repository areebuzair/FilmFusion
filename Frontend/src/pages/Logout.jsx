import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <>Logout Page</>;
};

export default Logout;
