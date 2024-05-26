import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCards, FreeMode } from "swiper/modules";
import "swiper/css/bundle";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { APP_ROUTES } from "../../router/Route";
import axios from "axios";
import "./Course.scss";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import updateIcon from "../../images/updateIcon.svg";
import deleteIcon from "../../images/deleteIcon.svg";

import SideBar from "../SideBar/SideBar";
import TopSideBar from "../TopSideBar/TopSideBar";

function Course() {
  const title = "Админ панель";
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);
  const [choosenColor, setChoosenColor] = useState(1);
  const [choosenCreateStep, setChoosenCreateStep] = useState(1);
  const [courseUpdate, setCourseUpdate] = useState(false);
  const [courseId, setCourseId] = useState(0);
  const [allCourses, setAllCourses] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [moduleId, setModuleId] = useState(0);
  const [moduleUpdate, setModuleUpdate] = useState(false);
  const [lessonUpdate, setLessonUpdate] = useState(false);
  const [lessonId, setLessonId] = useState(0);
  const [lessonObject, setLessonObject] = useState({
    file: [],
    title: "",
    time: "",
    moduleId: 0,
    items: [],
  });
  const [courseObject, setCourseObject] = useState({
    title: "",
    description: "",
    author: "",
    time: "",
    files: [],
  });
  const [moduleObject, setModuleObject] = useState({
    title: "",
    time: "",
    courseId: 0,
  });

  useEffect(() => {
    updateAllStates();
  }, []);

  const toggleSideBar = (boolValue) => {
    setIsOpenSideBar(boolValue);
  };

  const getallCourses = async () => {
    try {
      const response = await axios.get(`${APP_ROUTES.URL}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });

      setAllCourses(response.data);
    } catch (error) {
      toast.error("Произошла ошибка при загрузке курсов");
    }
  };

  const getallModules = async () => {
    try {
      const response = await axios.get(`${APP_ROUTES.URL}/modules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });
      setAllModules(response.data);
    } catch (error) {
      toast.error("Произошла ошибка при загрузке категорий");
    }
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
    getallCourses();
    getallModules();
    getallLessons();
  };

  const createModule = async () => {
    if (!moduleObject.title || !moduleObject.time || !moduleObject.courseId)
      return toast.error("Введите все данные!");
    try {
      const response = await axios.post(
        `${APP_ROUTES.URL}/modules`,
        {
          title: moduleObject.title,
          time: moduleObject.time,
          courseId: moduleObject.courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );

      toast.success("Модуль успешно создан");
      updateAllStates();
      cancelUpdateModule();
    } catch (error) {
      toast.error("Произошла ошибка при создании модули");
    }
  };

  const createCourse = async () => {
    if (
      !courseObject.title ||
      !courseObject.description ||
      !courseObject.author ||
      !courseObject.time ||
      courseObject.files.length < 1
    ) {
      if (!courseObject.title) toast.error("Введите название курса");
      if (!courseObject.description) toast.error("Введите описание курса");
      if (!courseObject.author) toast.error("Введите автора курса");
      if (!courseObject.time) toast.error("Введите время курса");
      if (courseObject.files.length < 1) toast.error("Выберите фото курса");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("@token")}`
    );

    const formdata = new FormData();
    formdata.append("files", courseObject.files[0], courseObject.files[0].name);
    formdata.append("title", courseObject.title);
    formdata.append("description", courseObject.description);
    formdata.append("author", courseObject.author);
    formdata.append("time", courseObject.time);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${APP_ROUTES.URL}/courses`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => toast.error("Произошла ошибка при создании Курса"));

    toast.success("Урок успешно создан!");
    updateAllStates();
    cancelUpdateCourse();
  };

  const createLesson = async () => {
    if (
      !lessonObject.title ||
      !lessonObject.file ||
      !lessonObject.time ||
      !lessonObject.moduleId
    ) {
      return toast.error("Введите все данные!");
    }

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("@token")}`
    );

    const formdata = new FormData();

    if (lessonObject.file.length > 0) {
      formdata.append("files", lessonObject.file[0], lessonObject.file[0].name);
    }

    if (lessonObject.items[0]) {
      formdata.append(
        "files",
        lessonObject.items[0],
        lessonObject.items[0].name
      );
    }
    if (lessonObject.items[1]) {
      formdata.append(
        "files",
        lessonObject.items[1],
        lessonObject.items[1].name
      );
    }
    if (lessonObject.items[2]) {
      formdata.append(
        "files",
        lessonObject.items[2],
        lessonObject.items[2].name
      );
    }

    formdata.append("title", lessonObject.title);
    formdata.append("time", lessonObject.time);
    formdata.append("moduleId", lessonObject.moduleId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${APP_ROUTES.URL}/lessons`, requestOptions);
      const result = await response.text();

      toast.success("Урок успешно создан");
      updateAllStates();
      cancelUpdateLesson();
    } catch (error) {
      toast.error("Произошла ошибка при создании урока");
    }
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

  const removeCourse = async (id) => {
    if (window.confirm("Вы уверены что хотите удалить супер категорию?")) {
      fetch(`${APP_ROUTES.URL}/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          toast.success("Курс успешно удален!");
          updateAllStates();
        })
        .catch((error) => {
          toast.error("Произошла ошибка при удалении курса");
        });
    }
  };

  const removeModule = async (id) => {
    if (window.confirm("Вы уверены что хотите удалить категорию?")) {
      fetch(`${APP_ROUTES.URL}/modules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          toast.success("Модуль успешно удален!");
          updateAllStates();
        })
        .catch((error) => {
          toast.error("Произошла ошибка при удалении модуля");
        });
    }
  };

  const handleFileInputchangeCourse = (event) => {
    if (event.target.files.length > 1) {
      toast.error("Максимальное количество фото 1");
      return;
    }

    const file = event.target.files[0];
    if (!file.type.startsWith("image")) {
      toast.error("Выберите фото");
      return;
    }

    setCourseObject((prev) => ({
      ...prev,
      files: [file],
    }));
  };

  const changeCourse = (id) => {
    setCourseId(id);
    setCourseUpdate(true);
    const course = allCourses.find((course) => course.id === id);
    setCourseObject({
      title: course.title,
      description: course.description,
      time: course.time,
      author: course.author,
      files: [],
    });
  };

  const updateCourse = async () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("@token")}`
    );

    const formdata = new FormData();
    if (courseObject.files[0]) {
      formdata.append("files", courseObject.files[0], "/path/to/file");
    }
    formdata.append("id", courseId);
    formdata.append("title", courseObject.title);
    formdata.append("description", courseObject.description);
    formdata.append("author", courseObject.author);
    formdata.append("time", courseObject.time);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${APP_ROUTES.URL}/courses`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => toast.error("Произошла ошибка при изменении курса"));

    toast.success("Курс успешно изменен");
    updateAllStates();
    setCourseUpdate(false);
    setCourseObject({
      ...courseObject,
      title: "",
      description: "",
      time: "",
      author: "",
    });
  };

  const cancelUpdateCourse = () => {
    setCourseObject({
      ...courseObject,
      title: "",
      description: "",
      time: "",
      files: [],
      author: "",
    });
    document.getElementById("course-file-input").value = "";
    setCourseUpdate(false);
  };

  const changeModule = (id) => {
    setModuleId(id);
    setModuleUpdate(true);
    const module = allModules.find((module) => module.id === id);

    setModuleObject({
      ...moduleObject,
      title: module.title,
      time: module.time,
      courseId: module.courseId,
    });
  };

  const updateModule = async () => {
    try {
      const response = await axios.patch(
        `${APP_ROUTES.URL}/modules/${moduleId}`,
        {
          title: moduleObject.title,
          time: moduleObject.time,
          courseId: moduleObject.courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );

      toast.success("Модуль успешно изменён!");
      updateAllStates();
      setModuleObject({
        ...moduleObject,
        title: "",
        time: "",
        courseId: 0,
      });
      setModuleUpdate(false);
    } catch (error) {
      toast.error("Произошла ошибка при изменении модуля");
    }
  };

  const cancelUpdateModule = () => {
    setModuleObject({
      ...moduleObject,
      title: "",
      courseId: 0,
      time: "",
    });
    setModuleUpdate(false);
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

    if (lessonObject.file.length > 0) {
      formdata.append("files", lessonObject.file[0], lessonObject.file[0].name);
    }

    if (lessonObject.items[0]) {
      formdata.append(
        "files",
        lessonObject.items[0],
        lessonObject.items[0].name
      );
    }
    if (lessonObject.items[1]) {
      formdata.append(
        "files",
        lessonObject.items[1],
        lessonObject.items[1].name
      );
    }
    if (lessonObject.items[2]) {
      formdata.append(
        "files",
        lessonObject.items[2],
        lessonObject.items[2].name
      );
    }

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
    setChoosenColor(1);
    document.getElementById("file-input").value = "";
    document.getElementById("items-input").value = "";
    setLessonObject({
      file: [],
      title: "",
      time: "",
      moduleId: 0,
      items: [],
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
          <div className="mainInfoCardsContainer">
            <div className="mainInfoCard">
              <div className="cardTitle">Уроки</div>
              <div className="cardQty">{allLessons.length}</div>
              <div className="plusIcon" onClick={() => setChoosenCreateStep(1)}>
                +
              </div>
            </div>
            <div className="mainInfoCard">
              <div className="cardTitle">Курсы</div>
              <div className="cardQty">{allCourses.length}</div>
              <div className="plusIcon" onClick={() => setChoosenCreateStep(2)}>
                +
              </div>
            </div>
            <div className="mainInfoCard">
              <div className="cardTitle">Модули</div>
              <div className="cardQty">{allModules.length}</div>
              <div className="plusIcon" onClick={() => setChoosenCreateStep(3)}>
                +
              </div>
            </div>
          </div>

          <div className="corporativeCreateWrapper">
            <div
              className={`corporativeCreate ${
                choosenCreateStep === 1 && "choosenStep"
              }`}
            >
              <h2 className="headingCreate">
                {lessonUpdate ? "Изменить урок" : "Новый урок"}
              </h2>
              <div className="formInputs">
                <div className="textInputsWrapper">
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Наименование урока *</label>
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
                        {allModules.map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="imageInputsWrapper">
                  <label>Выберите видео *</label>
                  <input
                    className="selectImageIconInput"
                    type="file"
                    id="file-input"
                    placeholder="Загрузить видео"
                    accept="video/mp4, video/mkv, video/avi"
                    onChange={(e) =>
                      setLessonObject({
                        ...lessonObject,
                        file: e.target.files,
                      })
                    }
                  />
                  <label>Выберите доп. файлы *</label>
                  <input
                    className="selectImageIconInput"
                    type="file"
                    id="items-input"
                    placeholder="Загрузить видео"
                    multiple
                    onChange={(e) => {
                      setLessonObject({
                        ...lessonObject,
                        items: e.target.files,
                      });
                      console.log(e.target.files);
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className={`corporativeCreate ${
                choosenCreateStep === 2 && "choosenStep"
              }`}
            >
              <h2 className="headingCreate">
                {courseUpdate ? "Изменить курс" : "Новый курс"}
              </h2>
              <div className="formInputs">
                <div className="textInputsWrapper">
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Наименование Курса *</label>
                      <input
                        type="text"
                        value={courseObject.title}
                        onChange={(e) =>
                          setCourseObject({
                            ...courseObject,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="textInput">
                      <label>Описание Курса *</label>
                      <input
                        type="text"
                        value={courseObject.description}
                        onChange={(e) =>
                          setCourseObject({
                            ...courseObject,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="buttonsWrapper">
                      <button
                        onClick={() =>
                          courseUpdate ? updateCourse() : createCourse()
                        }
                      >
                        {courseUpdate ? "Изменить" : "Создать"}
                      </button>
                      <button onClick={() => cancelUpdateCourse()}>
                        Отмена
                      </button>
                    </div>
                  </div>
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Автор Курса *</label>
                      <input
                        type="text"
                        value={courseObject.author}
                        onChange={(e) =>
                          setCourseObject({
                            ...courseObject,
                            author: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="textInput">
                      <label>Длительность Курса *</label>
                      <input
                        type="text"
                        value={courseObject.time}
                        placeholder="Пример: 1 oy"
                        onChange={(e) =>
                          setCourseObject({
                            ...courseObject,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="imageInputsWrapper">
                  <label>Выберите Фото *</label>
                  <input
                    className="selectImageIconInput"
                    type="file"
                    id="course-file-input"
                    placeholder="Загрузить фото"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileInputchangeCourse(e)}
                  />
                </div>
              </div>
            </div>

            <div
              className={`corporativeCreate ${
                choosenCreateStep === 3 && "choosenStep"
              }`}
            >
              <h2 className="headingCreate">
                {moduleUpdate ? "Изменить модуль" : "Новый модуль"}
              </h2>
              <div className="formInputs">
                <div className="textInputsWrapper">
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Наименование модуля *</label>
                      <input
                        type="text"
                        value={moduleObject.title}
                        onChange={(e) =>
                          setModuleObject({
                            ...moduleObject,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="textInput">
                      <label>Длительность модуля *</label>
                      <input
                        type="text"
                        value={moduleObject.time}
                        onChange={(e) =>
                          setModuleObject({
                            ...moduleObject,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="textInput">
                      <label>К какому курсу принадлежит *</label>
                      <select
                        name=""
                        id=""
                        value={moduleObject.courseId}
                        onChange={(e) =>
                          setModuleObject({
                            ...moduleObject,
                            courseId: Number(e.target.value),
                          })
                        }
                      >
                        <option hidden value="">
                          Выберите супер категорию
                        </option>
                        {allCourses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="buttonsWrapper">
                      <button
                        onClick={() =>
                          moduleUpdate ? updateModule() : createModule()
                        }
                      >
                        {moduleUpdate ? "Изменить" : "Создать"}
                      </button>
                      <button onClick={() => cancelUpdateModule()}>
                        Отмена
                      </button>
                    </div>
                  </div>
                  <div className="textInputsLine"></div>
                </div>
              </div>
            </div>
          </div>

          {allLessons.length > 0 && (
            <div
              className={`table ${choosenCreateStep === 1 && "choosenStep"}`}
            >
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem">Наименование</div>
                  <div className="tableHeaderItem">Модуль</div>
                  <div className="tableHeaderItem smallItem">Изменить</div>
                  <div className="tableHeaderItem smallItem">Удалить</div>
                </div>
                <div className="tableBody">
                  {allLessons.map((lesson, index) => (
                    <div className="tableBodyItemWrapper" key={index}>
                      <div className="tableBodyItem smallItem">{index + 1}</div>
                      <div className="tableBodyItem">{lesson.title}</div>
                      <div className="tableBodyItem">
                        {allModules.map((module) => {
                          if (module.id === lesson.moduleId) {
                            return module.title;
                          }
                        })}
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

          {allCourses.length > 0 && (
            <div
              className={`table ${choosenCreateStep === 2 && "choosenStep"}`}
            >
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem">Наименование</div>
                  <div className="tableHeaderItem smallItem">Изменить</div>
                  <div className="tableHeaderItem smallItem">Удалить</div>
                </div>
                <div className="tableBody">
                  {allCourses.map((course) => (
                    <div className="tableBodyItemWrapper" key={course.id}>
                      <div className="tableBodyItem smallItem">{course.id}</div>
                      <div className="tableBodyItem">{course.title}</div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="change"
                          onClick={() => changeCourse(course.id)}
                        >
                          <img src={updateIcon} alt={updateIcon} />
                        </div>
                      </div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="remove"
                          onClick={() => removeCourse(course.id)}
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

          {allModules.length > 0 && (
            <div
              className={`table ${choosenCreateStep === 3 && "choosenStep"}`}
            >
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem">Наименование</div>
                  <div className="tableHeaderItem">Курс</div>
                  <div className="tableHeaderItem smallItem">Изменить</div>
                  <div className="tableHeaderItem smallItem">Удалить</div>
                </div>
                <div className="tableBody">
                  {allModules.map((module) => (
                    <div className="tableBodyItemWrapper" key={module.id}>
                      <div className="tableBodyItem smallItem">{module.id}</div>
                      <div className="tableBodyItem">{module.title}</div>
                      <div className="tableBodyItem">
                        {allCourses.map((course) => {
                          if (course.id === module.courseId) {
                            return course.title;
                          }
                        })}
                      </div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="change"
                          onClick={() => changeModule(module.id)}
                        >
                          <img src={updateIcon} alt={updateIcon} />
                        </div>
                      </div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="remove"
                          onClick={() => removeModule(module.id)}
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
  );
}

export default Course;
