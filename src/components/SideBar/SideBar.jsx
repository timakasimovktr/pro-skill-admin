import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCards, FreeMode } from "swiper/modules";
import "swiper/css/bundle";
import { APP_ROUTES } from "../../router/Route";
import axios from "axios";
import "./SideBar.scss";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

import userIcon from "../../images/user.svg";
import messangerIcon from "../../images/messangerIcon.svg";
import refferalIcon from "../../images/refIcon.svg";
import corporativeIcon from "../../images/corporativeIcon.svg";

function SideBar(props) {
  const role = localStorage.getItem("@role");

  const logout = () => {
    if (!window.confirm("Вы уверены что хотите выйти из системы?")) return;
    localStorage.removeItem("@token");
    localStorage.removeItem("@role");
    window.location.reload();
  };

  return (
    <>
      <div className="sideBar">
        <div className="adminIcon">
          <div className="adminIconWrapper">
            <div className="iconAdmin">
              <img src={userIcon} alt={userIcon} />
            </div>
            <h3>Admin - {props.title}</h3>
          </div>
        </div>
        <div className="sideBarNav">
          {role === "admin" && (
            <>
              <Link
                reloadDocument
                to={APP_ROUTES.COURSE}
                className={`navLink ${
                  props.title === "Админ панель" && "isActive"
                }`}
              >
                <div className="navLinkIcon">
                  <img src={corporativeIcon} alt={corporativeIcon} />
                </div>
                <h4>Админ панель</h4>
              </Link>
              <Link
                reloadDocument
                to={APP_ROUTES.TESTS}
                className={`navLink ${
                  props.title === "Тесты к урокам" && "isActive"
                }`}
              >
                <div className="navLinkIcon">
                  <img src={refferalIcon} alt={refferalIcon} />
                </div>
                <h4>Тесты к урокам</h4>
              </Link>
              <Link
                reloadDocument
                to={APP_ROUTES.MESSAGES}
                className={`navLink ${
                  props.title === "Заявки клиеннтов" && "isActive"
                }`}
              >
                <div className="navLinkIcon">
                  <img src={messangerIcon} alt={messangerIcon} />
                </div>
                <h4>Заявки клиеннтов</h4>
              </Link>
            </>
          )}

          {role === "mentor" && (
            <>
              <Link
                reloadDocument
                to={APP_ROUTES.CHAT}
                className={`navLink ${
                  props.title === "Чат со студентами" && "isActive"
                }`}
              >
                <div className="navLinkIcon">
                  <img src={messangerIcon} alt={messangerIcon} />
                </div>
                <h4>Чат со студентами</h4>
              </Link>
            </>
          )}

          {/* <Link reloadDocument to={APP_ROUTES.REFERRAL} className={`navLink ${props.title === "Рефералка" && 'isActive'}`}>
            <div className="navLinkIcon">
              <img src={refferalIcon} alt={refferalIcon} />
            </div>
            <h4>Рефералка</h4>
          </Link>
          <Link reloadDocument to={APP_ROUTES.MESSENGER} className={`navLink ${props.title === "Мессенджер" && 'isActive'}`}>
            <div className="navLinkIcon">
              <img src={messangerIcon} alt={messangerIcon} />
            </div>
            <h4>Мессенджер</h4>
          </Link> */}
        </div>
        {/* <div className="sideBarNotifications">
          <h3>Уведомления</h3>

          <div className="notificationItem">
            <div className="notificationIcon"></div>
            <div className="notificationMessage">
              <h4>Новый заказ</h4>
              <p>Сегодня в 12:00</p>
            </div>
          </div>
        </div> */}
        <div className="logout">
          <button onClick={() => logout()}>Выйти</button>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default SideBar;
