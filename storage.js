export function saveResult(resultObj) {
    let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
    history.push(resultObj);
    localStorage.setItem('quizHistory', JSON.stringify(history));
  }
  
  export function loadHistory() {
    const historyListEl = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
    historyListEl.innerHTML = '';
    history.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.date} - ${item.category} (${item.difficulty}) - ${item.score}/5`;
      historyListEl.appendChild(li);
    });
  }
  