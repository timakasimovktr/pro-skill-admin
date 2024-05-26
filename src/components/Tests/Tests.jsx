import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCards, FreeMode } from "swiper/modules";
import "swiper/css/bundle";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { APP_ROUTES } from "../../router/Route";
import axios from "axios";
import "./Tests.scss";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import updateIcon from "../../images/updateIcon.svg";
import deleteIcon from "../../images/deleteIcon.svg";

import SideBar from "../SideBar/SideBar";
import TopSideBar from "../TopSideBar/TopSideBar";

function Course() {
  const title = "Тесты к урокам";
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);
  const [allLessons, setAllLessons] = useState([]);
  const [lessonUpdate, setLessonUpdate] = useState(false);
  const [lessonId, setLessonId] = useState(0);
  const [lessonObject, setLessonObject] = useState({
    file: [],
    title: "",
    time: "",
    moduleId: 0,
  });

  useEffect(() => {
    updateAllStates();
  }, []);

  const toggleSideBar = (boolValue) => {
    setIsOpenSideBar(boolValue);
  };

  const getallLessons = async () => {
    try {
      const response = await axios.get(`${APP_ROUTES.URL}/lessons`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });
      setAllLessons(response.data);
    } catch (error) {
      toast.error("Произошла ошибка при загрузке уроков");
    }
  };

  const updateAllStates = () => {
    getallLessons();
  };

  const createLesson = async () => {
    console.log(lessonObject);
    if (
      !lessonObject.title ||
      !lessonObject.file ||
      !lessonObject.time ||
      !lessonObject.moduleId
    )
      return toast.error("Введите все данные!");

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("@token")}`
    );

    const formdata = new FormData();
    formdata.append("file", lessonObject.file[0], "/path/to/file");
    formdata.append("title", lessonObject.title);
    formdata.append("time", lessonObject.time);
    formdata.append("moduleId", lessonObject.moduleId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${APP_ROUTES.URL}/lessons`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        toast.success("Урок успешно создан");
        updateAllStates();
        cancelUpdateLesson();
      })
      .catch((error) => toast.error("Произошла ошибка при создании урока"));
  };

  const removeLesson = async (id) => {
    if (window.confirm("Вы уверены что хотите удалить урок?")) {
      fetch(`${APP_ROUTES.URL}/lessons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          toast.success("Урок успешно удален!");
          updateAllStates();
        })
        .catch((error) => {
          toast.error("Произошла ошибка при удалении урока");
        });
    }
  };

  const changeLesson = (id) => {
    setLessonId(id);
    setLessonUpdate(true);
    const lesson = allLessons.find((lesson) => lesson.id === id);
    setLessonObject({
      ...lessonObject,
      title: lesson.title,
      time: lesson.time,
      moduleId: lesson.moduleId,
    });
  };

  const updateLesson = async () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("@token")}`
    );
  
    const formdata = new FormData();
    formdata.append("id", lessonId);
    formdata.append("title", lessonObject.title);
    formdata.append("time", lessonObject.time);
    formdata.append("moduleId", lessonObject.moduleId);
  
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`${APP_ROUTES.URL}/lessons`, requestOptions);
      const result = await response.text();
  
      if (response.ok) {
        toast.success("Урок успешно изменен");
        updateAllStates();
        cancelUpdateLesson();
      } else {
        toast.error("Произошла ошибка при изменении урока");
        console.error(result);
      }
    } catch (error) {
      toast.error("Произошла ошибка при изменении урока");
      console.error(error);
    }
  };
  
  const cancelUpdateLesson = () => {
    setLessonUpdate(false);
    document.getElementById("file-input").value = "";
    setLessonObject({
      file: [],
      title: "",
      time: "",
      moduleId: 0,
    });
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

          <div className="corporativeCreateWrapper" style={{marginTop: "20px"}}>
            <div
              className={`corporativeCreate choosenStep`}
            >
              <h2 className="headingCreate">
                {lessonUpdate ? "Изменить Тест" : "Новый Тест"}
              </h2>
              <div className="formInputs">
                <div className="textInputsWrapper">
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Вопрос урока *</label>
                      <input
                        type="text"
                        value={lessonObject.title}
                        onChange={(e) =>
                          setLessonObject({
                            ...lessonObject,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="textInput">
                      <label>Длительность урока *</label>
                      <input
                        type="text"
                        value={lessonObject.time}
                        onChange={(e) =>
                          setLessonObject({
                            ...lessonObject,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="buttonsWrapper">
                      <button
                        onClick={() =>
                          lessonUpdate ? updateLesson() : createLesson()
                        }
                      >
                        {lessonUpdate ? "Изменить" : "Создать"}
                      </button>
                      <button onClick={() => cancelUpdateLesson()}>
                        Отмена
                      </button>
                    </div>
                  </div>
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Модуль урока *</label>
                      <select
                        name=""
                        id=""
                        value={lessonObject.moduleId}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setLessonObject({
                            ...lessonObject,
                            moduleId: +e.target.value,
                          });
                        }}
                      >
                        <option hidden value="">
                          Выберите модуль
                        </option>
                        {/* {allModules.map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.title}
                          </option>
                        ))} */}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="imageInputsWrapper">
                  <label>Выберите Видео *</label>
                  <input
                    className="selectImageIconInput"
                    type="file"
                    id="file-input"
                    placeholder="Загрузить видео"
                    multiple
                    accept="video/mp4, video/mkv, video/avi"
                    onChange={(e) =>
                      setLessonObject({ ...lessonObject, file: e.target.files })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {allLessons.length > 0 && (
            <div
              className={`table choosenStep`}
            > 
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem">Вопрос</div>
                  <div className="tableHeaderItem">Урок</div>
                  <div className="tableHeaderItem smallItem">Изменить</div>
                  <div className="tableHeaderItem smallItem">Удалить</div>
                </div>
                <div className="tableBody">
                  {allLessons.map((lesson, index) => (
                    <div className="tableBodyItemWrapper" key={index}>
                      <div className="tableBodyItem smallItem">{index + 1}</div>
                      <div className="tableBodyItem">{lesson.title}</div>
                      <div className="tableBodyItem">
                        {/* {allModules.map((module) => {
                          if (module.id === lesson.moduleId) {
                            return module.title;
                          }
                        })} */}
                      </div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="change"
                          onClick={() => changeLesson(lesson.id)}
                        >
                          <img src={updateIcon} alt={updateIcon} />
                        </div>
                      </div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="remove"
                          onClick={() => removeLesson(lesson.id)}
                        >
                          <img src={deleteIcon} alt={deleteIcon} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Outlet />
    </>
  )
}

export default Course;
