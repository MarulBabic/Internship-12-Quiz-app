let confirmTimer = null;
let currentSelectedLi = null;

export async function fetchQuizData(params) {
  const url = `https://opentdb.com/api.php?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

export function renderQuestion(questionObj, confirmationCallback) {
  const questionTextEl = document.getElementById('question-text');
  const answersListEl = document.getElementById('answers-list');
  
  questionTextEl.innerHTML = decodeHTML(questionObj.question);
  answersListEl.innerHTML = '';
  
  let answers = [...questionObj.incorrect_answers, questionObj.correct_answer];
  answers = shuffleArray(answers);
  
  currentSelectedLi = null;
  if(confirmTimer) {
    clearTimeout(confirmTimer);
    confirmTimer = null;
  }
  
  answers.forEach(answer => {
    const li = document.createElement('li');
    li.innerHTML = decodeHTML(answer);
    li.addEventListener('click', () => handleAnswerClick(li, answer, questionObj.correct_answer, confirmationCallback));
    answersListEl.appendChild(li);
  });
}

function handleAnswerClick(li, selectedAnswer, correctAnswer, confirmationCallback) {
  if(confirmTimer) {
    clearTimeout(confirmTimer);
    removeSelectionFromAll();
  }
  
  li.classList.add('selected');
  currentSelectedLi = li;
  
  confirmTimer = setTimeout(() => {
    const userConfirmed = confirm("Zaključujete odgovor?");
    if(userConfirmed) {
      lockAnswers(selectedAnswer, correctAnswer);
      confirmationCallback(selectedAnswer === correctAnswer);
    } else {
      li.classList.remove('selected');
      currentSelectedLi = null;
    }
    clearTimeout(confirmTimer);
    confirmTimer = null;
  }, 2000);
}

function removeSelectionFromAll() {
  const allLis = document.querySelectorAll('#answers-list li');
  allLis.forEach(li => li.classList.remove('selected'));
}

function lockAnswers(selectedAnswer, correctAnswer) {
  const allLis = document.querySelectorAll('#answers-list li');
  allLis.forEach(li => {
    li.style.pointerEvents = 'none';
    const answerText = li.textContent;
    if(answerText === decodeHTML(correctAnswer)) {
      li.classList.add('correct');
    } else if(answerText === decodeHTML(selectedAnswer)) {
      li.classList.add('wrong');
    }
  });
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export { lockAnswers };