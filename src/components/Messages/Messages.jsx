import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { APP_ROUTES } from "../../router/Route";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import TopSideBar from "../TopSideBar/TopSideBar";
import deleteIcon from "../../images/deleteIcon.svg";

function Messages() {
  const title = "Заявки клиеннтов";
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);
  const [allLessons, setAllLessons] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    getAllQuestions();
  }, []);

  const navigate = useNavigate();

  const toggleSideBar = (boolValue) => {
    setIsOpenSideBar(boolValue);
  };

  const getAllQuestions = async () => {
    try {
      const response = await axios.get(`${APP_ROUTES.URL}/sms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });
      setAllQuestions(response.data);
    } catch (error) {
      toast.error("Произошла ошибка при загрузке вопросов");
    }
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {isOpenSideBar && <SideBar title={title} />}
      <div className="mainInfo">
        <TopSideBar
          title={title}
          toggleSideBar={toggleSideBar}
          isOpenSideBar={isOpenSideBar}
        />
        <div className="mainInfoContainer">
          {allQuestions.length > 0 && (
            <div className="table choosenStep" style={{ paddingTop: "20px" }}>
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem">Имя и Фамилия</div>
                  <div className="tableHeaderItem">Телефон</div>
                  <div className="tableHeaderItem" style={{minWidth: "400px"}}>Сообщение</div>
                  <div className="tableHeaderItem smallItem" style={{minWidth: "200px"}}>Дата</div>
                </div>
                <div className="tableBody">
                  {allQuestions.toReversed().map((question, index) => (
                    <div className="tableBodyItemWrapper" key={index}>
                      <div className="tableBodyItem smallItem">{index + 1}</div>
                      <div className="tableBodyItem">
                        {question.name} {question.surname}
                      </div>
                      <div className="tableBodyItem">
                        {question.phoneNumber}
                      </div>
                      <div className="tableBodyItem" style={{minWidth: "400px"}}>{question.sms}</div>
                      <div className="tableBodyItem smallItem" style={{minWidth: "200px"}}>
                        {new Date(question.createdAt).toLocaleString(
                          "default",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Messages;
