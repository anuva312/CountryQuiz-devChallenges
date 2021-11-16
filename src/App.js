import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentQuiz, setCurrentQuiz] = useState();
  const [options, setOptions] = useState();
  const questionTypes = ["flag", "capital", "coatOfArms"];
  const noOfOptions = 4;
  const noOfQuestionTypes = questionTypes.length;
  const [countriesDetails, setCountriesDetails] = useState();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [gotAnswerRight, setGotAnswerRight] = useState(true);
  const [isResultsPage, setIsResultsPage] = useState(false);
  const [countOfQuestions, setCountOfQuestions] = useState(0);

  const getRandomIntegers = function (optionsCount, countriesCount) {
    const random_list = Array.from({ length: optionsCount }, () =>
      Math.floor(Math.random() * countriesCount)
    );
    const distinct_Random_list = new Set(random_list);
    // console.log(random_list, distinct_Random_list);
    return random_list.length === distinct_Random_list.size
      ? random_list
      : getRandomIntegers(optionsCount, countriesCount);
  };

  const getQuestion = function () {
    if (countriesDetails) {
      let quiz = {};
      const answer_options = getRandomIntegers(
        noOfOptions,
        countriesDetails.length
      );
      const options_alphabets = ["A. ", "B. ", "C. ", "D. "];
      const right_answer =
        answer_options[Math.floor(Math.random() * noOfOptions)];
      // console.log("Right Answer", right_answer);
      const type = questionTypes[Math.floor(Math.random() * noOfQuestionTypes)];
      switch (type) {
        case "flag":
          quiz = {
            image: countriesDetails[right_answer].flags,
            question: "Which country does this flag belong to?",
            answer:
              options_alphabets[
                answer_options.findIndex((element) => element === right_answer)
              ] + countriesDetails[right_answer].name,
          };
          break;
        case "capital":
          quiz = {
            question: `${countriesDetails[right_answer].capital} is the capital of...`,
            answer:
              options_alphabets[
                answer_options.findIndex((element) => element === right_answer)
              ] + countriesDetails[right_answer].name,
          };
          break;
        case "coatOfArms":
          quiz = {
            image: countriesDetails[right_answer].coatOfArms,
            question: "This is the Coat of Arms of...",
            answer:
              options_alphabets[
                answer_options.findIndex((element) => element === right_answer)
              ] + countriesDetails[right_answer].name,
          };
          break;
        default:
          break;
      }
      // console.log(quiz);
      setCurrentQuiz(quiz);
      setOptions(
        answer_options.map(
          (option, index) =>
            options_alphabets[index] + countriesDetails[option].name
        )
      );
    }
  };

  const onSubmitAnswer = function (event) {
    const selectedElement = event.target;
    const result = selectedElement.innerHTML === currentQuiz.answer;
    if (result) {
      setCountOfQuestions(countOfQuestions + 1);
      setGotAnswerRight(true);
    } else {
      setGotAnswerRight(false);
      selectedElement.innerHTML +=
        '<span class="material-icons">highlight_off</span>';
    }
    setIsAnswerSelected(event.target);
    selectedElement.classList.add("selected");
  };

  const onClickNext = function () {
    const newQuiz = { ...currentQuiz };
    delete newQuiz["image"];
    setCurrentQuiz(newQuiz);
    isAnswerSelected.classList.remove("selected");
    setGotAnswerRight(false);
    setIsAnswerSelected(false);
    getQuestion();
  };

  useEffect(() => {
    async function getCountryDetails() {
      // console.log("Inside Get Details");
      const url = "https://restcountries.com/v3.1/all";
      try {
        const response = await (await fetch(url)).json();
        // console.log(response);
        const details = response?.map((country) => {
          const countryDetail = {
            name: country.name.common,
            capital: country.capital, //.join(", "),
            coatOfArms: country.coatOfArms.png
              ? country.coatOfArms.png
              : country.coatOfArms.svg,
            flags: country.flags.png, // || country.flags.svg,
          };
          return countryDetail;
        });

        // console.log(details);
        setCountriesDetails(details);
      } catch (error) {
        console.log(error);
      }
    }
    getCountryDetails();
  }, []);
  return (
    <div className="App">
      <div className="quiz-heading">Country Quiz</div>
      <div className="quiz-container">
        {countriesDetails ? (
          <div>
            {!currentQuiz && !isResultsPage ? (
              <div>
                <div className="start-image">
                  <img
                    src={"/assets/images/quiz-result.PNG"}
                    alt="country-question"
                  ></img>
                </div>
                <div className="start-button-container">
                  <button
                    className="start-button"
                    onClick={() => getQuestion()}
                  >
                    Start
                  </button>
                </div>
              </div>
            ) : isResultsPage ? (
              <div>
                <div className="result-image">
                  <img
                    src={"/assets/images/quiz-result.PNG"}
                    alt="country-question"
                  ></img>
                </div>
                <div className="result-heading">Results</div>
                <div className="result-count">
                  You got{" "}
                  <span className="right-answer-count">{countOfQuestions}</span>{" "}
                  right answers
                </div>
                <div className="start-button-container">
                  <button
                    className="try-again-button"
                    onClick={() => {
                      setCurrentQuiz(false);
                      setIsResultsPage(false);
                      setIsAnswerSelected(false);
                      setCountOfQuestions(0);
                      setGotAnswerRight(true);
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="quiz-question-container">
                {currentQuiz.image && (
                  <div className="quiz-image">
                    <img src={currentQuiz.image} alt="country-question"></img>
                  </div>
                )}
                <div className="quiz-question">{currentQuiz?.question}</div>
                <div className="quiz-options">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className={`quiz-option-button ${
                        option === currentQuiz.answer
                          ? `right-answer ${isAnswerSelected ? "selected" : ""}`
                          : "wrong-answer"
                      } `}
                      onClick={(e) => onSubmitAnswer(e)}
                      disabled={isAnswerSelected}
                    >
                      {option}
                      {option === currentQuiz.answer && isAnswerSelected && (
                        <span className="material-icons">
                          check_circle_outline
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="next-results-button-container">
                  {gotAnswerRight && isAnswerSelected ? (
                    <button
                      className={"next-button"}
                      onClick={() => onClickNext()}
                    >
                      Next
                    </button>
                  ) : !gotAnswerRight && isAnswerSelected ? (
                    <button
                      className={"next-button"}
                      onClick={() => setIsResultsPage(true)}
                    >
                      Results
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
}

export default App;
