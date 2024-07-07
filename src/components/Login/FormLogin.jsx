import React, { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../router/Route";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../images/logo.svg";

function FormLogin() {
  const [loginInput, setLoginInput] = useState("");
  const [passInput, setpassInput] = useState("");
  const url = `${APP_ROUTES.URL}/admin/login`;
  const navigation = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(url, {
        name: loginInput,
        password: passInput,
      });

      const token = response.data.access_token;
      
      if (token) {
        localStorage.setItem("@token", token);
        localStorage.setItem("@role", response.data.role);
        if (response.data.role === "admin") {
          navigation(APP_ROUTES.COURSE, { replace: true });
        } else if (response.data.role === "mentor") {
          navigation(APP_ROUTES.CHAT, { replace: true });
        } else if (response.data.role === "finance") {
          navigation(APP_ROUTES.FINANCE, { replace: true });
        } else {
          toast.error("Не верный логин или пароль");
        }
      }
    } catch (error) {
      toast.error("Не верный логин или пароль");
    }
  };

  return (
    <div className="modalWrapper">
      <ToastContainer />
      <div className="headerComponents">
        <img src={logo} alt={logo} />
      </div>
      <div className="formWrapper">
        <div className="inputElement">
          <input
            type="text"
            placeholder="Логин"
            id="login"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            name="login"
          />
        </div>
        <div className="inputElement">
          <input
            type="password"
            placeholder="Пароль"
            id="pass"
            value={passInput}
            onChange={(e) => setpassInput(e.target.value)}
            name="pass"
          />
        </div>
        <div className="sendDataWrapper">
          <button className="sendData" onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;
