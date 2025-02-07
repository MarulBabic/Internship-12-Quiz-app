import { fetchQuizData, renderQuestion, lockAnswers } from './quiz.js';
import { startQuestionTimer, clearQuestionTimer } from './timer.js';
import { saveResult, loadHistory } from './storage.js';

const quizForm = document.getElementById('quiz-form');
const setupSection = document.getElementById('setup-section');
const quizSection = document.getElementById('quiz-section');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionContainer = document.getElementById('question-container');


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
