import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCards, FreeMode } from "swiper/modules";
import "swiper/css/bundle";
import { APP_ROUTES } from "../../router/Route";
import axios from "axios";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import FormLogin from "./FormLogin";

function Login() {
  return (
    <>
      <div className="loginPage">
        <div className="gradient"></div>
        <FormLogin />
      </div>
      <Outlet />
    </>
  );
}

export default Login;
