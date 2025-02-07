import { fetchQuizData, renderQuestion, lockAnswers } from './quiz.js';
import { startQuestionTimer, clearQuestionTimer } from './timer.js';
import { saveResult, loadHistory } from './storage.js';

const quizForm = document.getElementById('quiz-form');
const setupSection = document.getElementById('setup-section');
const quizSection = document.getElementById('quiz-section');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionContainer = document.getElementById('question-container');
const nextQuestionBtn = document.getElementById('next-question-btn');
const resultSection = document.getElementById('result-section');
const finalScoreEl = document.getElementById('final-score');
const feedbackEl = document.getElementById('feedback');
const restartBtn = document.getElementById('restart-btn');

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let currentDifficulty = '';
let currentCategoryText = '';

quizForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;
  const type = document.getElementById('type').value;
  
  currentDifficulty = difficulty;
  currentCategoryText = document.getElementById('category').selectedOptions[0].text;
  
  const params = new URLSearchParams();
  params.append('amount', '5');
  params.append('difficulty', difficulty);
  params.append('type', type);
  if(category) {
    params.append('category', category);
  }
  
  quizData = await fetchQuizData(params);
  
  setupSection.style.display = 'none';
  quizSection.style.display = 'block';
  startQuizBtn.style.display = 'block';
  questionContainer.style.display = 'none';
});

startQuizBtn.addEventListener('click', () => {
    startQuizBtn.style.display = 'none';
    questionContainer.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    renderCurrentQuestion();
  });
  
  nextQuestionBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if(currentQuestionIndex < quizData.length) {
      renderCurrentQuestion();
    } else {
      questionContainer.style.display = 'none';
      resultSection.style.display = 'block';
      finalScoreEl.textContent = `Osvojili ste ${score} od 5 bodova.`;
      feedbackEl.textContent = generateFeedback(score);
      saveResult({
        score: score,
        difficulty: currentDifficulty,
        category: currentCategoryText,
        date: new Date().toLocaleString()
      });
      loadHistory();
    }
  });
  
  restartBtn.addEventListener('click', () => {
    location.reload();
  });
  
  function renderCurrentQuestion() {
      clearQuestionTimer();
    
      const answersListEl = document.getElementById('answers-list');
      answersListEl.style.pointerEvents = 'auto';
    
      renderQuestion(quizData[currentQuestionIndex], handleAnswerConfirmation);
    
      startQuestionTimer(20, () => {
        alert("Vrijeme je isteklo!");
        answersListEl.style.pointerEvents = 'none';
        lockAnswers('', quizData[currentQuestionIndex].correct_answer);
        nextQuestionBtn.style.display = 'block';
      });
      nextQuestionBtn.style.display = 'none';
    }
    
  
  function handleAnswerConfirmation(isCorrect) {
    clearQuestionTimer();
    if(isCorrect) {
      score++;
    }
    nextQuestionBtn.style.display = 'block';
  }
  
  function generateFeedback(score) {
    if(score === 5) return "Odličan rezultat!";
    if(score === 4) return "Vrlo dobro!";
    if(score === 3) return "Dobar rezultat!";
    if(score === 2) return "Može bolje!";
    return "Pokušaj ponovno!";
  }
  
  loadHistory();