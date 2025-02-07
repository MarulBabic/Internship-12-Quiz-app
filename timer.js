let questionTimerInterval;

export function startQuestionTimer(seconds, onTimeout) {
  const timerEl = document.getElementById('question-timer');
  timerEl.textContent = seconds;
  questionTimerInterval = setInterval(() => {
    seconds--;
    timerEl.textContent = seconds;
    if(seconds <= 0) {
      clearInterval(questionTimerInterval);
      if(typeof onTimeout === 'function') onTimeout();
    }
  }, 1000);
}

export function resetQuestionTimer(seconds, onTimeout) {
  clearInterval(questionTimerInterval);
  startQuestionTimer(seconds, onTimeout);
}

export function clearQuestionTimer() {
  clearInterval(questionTimerInterval);
}
