import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { APP_ROUTES } from "../../router/Route";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import TopSideBar from "../TopSideBar/TopSideBar";
import "./Tests.scss";
import deleteIcon from "../../images/deleteIcon.svg";

function Course() {
  const title = "Тесты к урокам";
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);
  const [allLessons, setAllLessons] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [answers, setAnswers] = useState([{ answer: "", isCorrect: false }]);
  const [selectedLesson, setSelectedLesson] = useState(0);

  useEffect(() => {
    getAllLessons();
    getAllQuestions();
  }, []);

  const navigate = useNavigate();

  const toggleSideBar = (boolValue) => {
    setIsOpenSideBar(boolValue);
  };

  const getAllLessons = async () => {
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

  const removeQuestion = async (questionId) => {
    try {
      const response = await axios.delete(
        `${APP_ROUTES.URL}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );
      toast.success("Вопрос успешно удален");
      getAllQuestions();
    } catch (error) {
      toast.error("Произошла ошибка при удалении вопроса");
    }
  };

  const getAllQuestions = async () => {
    try {
      const response = await axios.get(`${APP_ROUTES.URL}/questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@token")}`,
        },
      });
      setAllQuestions(response.data);
    } catch (error) {
      toast.error("Произошла ошибка при загрузке вопросов");
    }
  };

  const createQuestion = async () => {
    if (!questionTitle || !selectedLesson || answers.length < 2 || answers.findIndex((ans) => ans.isCorrect) === -1) {
      toast.error("Заполните все поля");
      return;
    }

    try {
      const response = await axios.post(
        `${APP_ROUTES.URL}/questions`,
        {
          title: questionTitle,
          answers: answers.map((ans) => ans.answer),
          correctAnswer: answers.findIndex((ans) => ans.isCorrect),
          lessonId: selectedLesson,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@token")}`,
          },
        }
      );
      toast.success("Вопрос успешно создан");
      setQuestionTitle("");
      setAnswers([{ answer: "", isCorrect: false }]);
      setSelectedLesson(0);
      getAllQuestions();
    } catch (error) {
      toast.error("Произошла ошибка при создании вопроса");
    }
  };

  const deleteAnswer = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers.splice(index, 1);
    setAnswers(updatedAnswers);
  };

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].answer = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleRadioChange = (index) => {
    const updatedAnswers = answers.map((ans, idx) => ({
      ...ans,
      isCorrect: idx === index,
    }));
    setAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, { answer: "", isCorrect: false }]);
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
          <div
            className="corporativeCreateWrapper"
            style={{ marginTop: "20px" }}
          >
            <div className={`corporativeCreate choosenStep`}>
              <h2 className="headingCreate">Новый тест к уроку</h2>
              <div className="formInputs">
                <div className="textInputsWrapper">
                  <div className="textInputsLine">
                    <div className="textInput">
                      <label>Вопрос *</label>
                      <input
                        type="text"
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                      />
                    </div>
                    <div className="buttonsWrapper">
                      <button onClick={createQuestion}>Создать</button>
                      <button onClick={() => navigate(-1)}>Отмена</button>
                    </div>
                  </div>
                  <div className="textInputsLine">
                    {answers.map((answer, index) => (
                      <div className="testInput" key={index}>
                        <label>Ответ *</label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="radio"
                            checked={answer.isCorrect}
                            onChange={() => handleRadioChange(index)}
                          />
                          <input
                            type="text"
                            value={answer.answer}
                            onChange={(e) => handleAnswerChange(index, e)}
                          />
                          <button
                            className="deleteAnswerBtn"
                            onClick={() => deleteAnswer(index)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="buttonsWrapper">
                      <button className="newAnswerBtn" onClick={addAnswer}>
                        Добавить ответ
                      </button>
                    </div>
                  </div>
                </div>
                <div className="imageInputsWrapper">
                  <label>Выберите Урок *</label>
                  <select
                    value={selectedLesson}
                    onChange={(e) =>
                      setSelectedLesson(parseInt(e.target.value))
                    }
                  >
                    <option value={0}>Выберите урок</option>
                    {allLessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* {allLessons.length > 0 && (
            <div
              className={`table ${choosenCreateStep === 1 && "choosenStep"}`}
            >
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem">Наименование</div>
                  <div className="tableHeaderItem">Модуль</div>
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
          )} */}

          {allQuestions.length > 0 && (
            <div className="table choosenStep">
              <div className="tableWrapper">
                <div className="tableHeader">
                  <div className="tableHeaderItem smallItem">ID</div>
                  <div className="tableHeaderItem" style={{minWidth: "500px"}}>Вопрос</div>
                  <div className="tableHeaderItem" style={{minWidth: "300px"}}>Урок</div>
                  <div className="tableHeaderItem smallItem">Удалить</div>
                </div>
                <div className="tableBody">
                  {allQuestions.toReversed().map((question, index) => (
                    <div className="tableBodyItemWrapper" key={index}>
                      <div className="tableBodyItem smallItem">{index + 1}</div>
                      <div className="tableBodyItem" style={{minWidth: "500px"}}>{question.title}</div>
                      <div className="tableBodyItem" style={{minWidth: "300px"}}>
                        {allLessons.map((lesson) => {
                          if (lesson.id === question.lessonId) {
                            return lesson.title;
                          }
                        })}
                      </div>
                      <div className="tableBodyItem smallItem">
                        <div
                          className="remove"
                          onClick={() => removeQuestion(question.id)}
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
    </>
  );
}

export default Course;
