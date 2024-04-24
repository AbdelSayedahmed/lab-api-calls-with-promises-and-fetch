const url = "https://opentdb.com/api.php?amount=10";
const main = document.querySelector("main");
const form = document.querySelector("form");

function setDifficulty(input) {
  if (input === "easy") return "#4f7d5d";
  if (input === "medium") return "#ebc934";
  if (input === "hard") return "#eb3434";
}

function shuffleAnswers(correctAnswer, incorrectAnswers) {
  let allAnswers = [correctAnswer, ...incorrectAnswers];

  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
  }
  return allAnswers;
}

function createCard(url) {
  fetch(url)
    .then((response) => response.json())
    .then(({ results }) => {
      console.log(results);
      for (const result of results) {
        const card = document.createElement("article");
        card.classList = "card";
        card.style.border = `3px solid ${setDifficulty(result.difficulty)}`;

        const shuffledAnswers = shuffleAnswers(
          result.correct_answer,
          result.incorrect_answers
        );

        const answersHTML = shuffledAnswers
          .map((answer) => {
            const answerElement = document.createElement("p");
            answerElement.textContent = answer;

            if (answer === result.correct_answer) {
              answerElement.classList.add("answer");
            }

            return answerElement.outerHTML;
          })
          .join("");

        card.innerHTML = `
            <h2>${result.category}</h2>
            <p>${result.question}</p>
            <button class="button">Show Answer</button>
            <div class="answers">
              ${answersHTML}
            </div>
          `;

        const button = card.querySelector(".button");
        const answers = card.querySelectorAll(".answer");

        main.appendChild(card);

        button.addEventListener("click", () => {
          answers.forEach((answer) => {
            answer.classList.toggle("hidden");
          });
        });
      }
    })
    .catch((error) => console.log("Error", error));
}

const difficultyLevels = ["easy", "medium", "hard"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = ""

  const difficulty = e.target.querySelector("select").value;
  const input = difficultyLevels.includes(difficulty) ? url + "&difficulty=" + difficulty : url;

  createCard(input);

  e.target.reset();
});
