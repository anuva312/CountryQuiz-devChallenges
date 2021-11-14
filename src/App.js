import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [currentQuiz, setCurrentQuiz] = useState({});
  const [questionType, setQuestionType] = useState();
  const questionTypes = ["flag", "capital", "coatOfArms"];
  const noOfOptions = 4;
  const noOfQuestionTypes = questionTypes.length;
  const countriesDetails = useRef();

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
    let quiz = {};
    const answer_options = getRandomIntegers(
      noOfOptions,
      countriesDetails.current.length
    );
    const right_answer =
      answer_options[Math.floor(Math.random() * noOfOptions)];
    // console.log("Right Answer", right_answer);
    const type = questionTypes[Math.floor(Math.random() * noOfQuestionTypes)];
    switch (type) {
      case "flag":
        quiz = {
          image: countriesDetails.current[right_answer].flags,
          question: "This is the national flag of...",
        };
        break;
      case "capital":
        quiz = {
          question: `${countriesDetails.current[right_answer].capital} is the capital of...`,
        };
        break;
      case "coatOfArms":
        quiz = {
          image: countriesDetails.current[right_answer].coatOfArms,
          question: "This is the Coat of Arms of...",
        };
        break;
      default:
        break;
    }
    // console.log(type, quiz, answer_options);
    setQuestionType(type);
    setCurrentQuiz(quiz);
  };

  useEffect(() => {
    async function getCountryDetails() {
      // console.log("Inside Get Details");
      const url = "https://restcountries.com/v3.1/all";
      try {
        const response = await (await fetch(url)).json();
        // console.log(response);
        countriesDetails.current = response?.map((country) => {
          const countryDetail = {
            name: country.name.common,
            capital: country.capital, //.join(", "),
            coatOfArms: country.coatOfArms,
            flags: country.flags.png, // || country.flags.svg,
          };
          return countryDetail;
        });

        // console.log(countriesDetails);
      } catch (error) {
        console.log(error);
      }
    }
    getCountryDetails();
  }, []);
  return (
    <div className="App">
      <header className="App-header"></header>
      <button onClick={() => getQuestion()}>Next Question</button>
    </div>
  );
}

export default App;
