import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCards, FreeMode } from "swiper/modules";
import "swiper/css/bundle";
import { APP_ROUTES } from "../../router/Route";
import axios from "axios";
import "./TopSideBar.scss";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

import sidebarIcon from "../../images/sidebar.svg";

function TopSideBar(props) {
  return (
    <>
      <div className="topSideBar">
        <div className="pageRoute">
          <div
            className="switchSideBarIcon"
            onClick={() => props.toggleSideBar(!props.isOpenSideBar)}
          >
            <img src={sidebarIcon} alt={sidebarIcon} />
          </div>
          <h3>
            PRO-SKILL <span className="slash">/</span>{" "}
            <span className="pageTitleinRoutes">{props.title}</span>
          </h3>
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default TopSideBar;
