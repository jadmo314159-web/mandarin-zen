import { initFlashcards } from './flashcards.js';
import { initMemoryGame } from './memory.js';

let allVocab = [];
let currentCat = 'Todas';
let currentView = 'flashcards';
let isDarkMode = false;

async function loadData() {
  try {
    const response = await fetch('data/vocabulario.json');
    allVocab = await response.json();
    initApp();
  } catch (error) {
    console.error('Error al cargar el vocabulario:', error);
  }
}

function initApp() {
  setupTheme();
  setupCategories();
  setupNavigation();
  updateView();
}

function setupTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  function updateThemeUI() {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    updateThemeUI();
  });

  updateThemeUI();
}

function setupCategories() {
  const categoriesContainer = document.getElementById('categories-container');
  const categorias = ['Todas', ...new Set(allVocab.map(v => v.cat))];

  categoriesContainer.innerHTML = categorias.map(cat => `
    <button
      data-cat="${cat}"
      class="cat-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors snap-start ${currentCat === cat ? 'bg-teal-500 text-white border-teal-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500'}"
    >
      ${cat}
    </button>
  `).join('');

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentCat = e.currentTarget.getAttribute('data-cat');
      setupCategories();
      updateView();
    });
  });
}

function setupNavigation() {
  const flashcardsNavBtn = document.getElementById('nav-flashcards');
  const memoryNavBtn = document.getElementById('nav-memory');

  flashcardsNavBtn.addEventListener('click', () => {
    currentView = 'flashcards';
    updateNavUI();
    updateView();
  });

  memoryNavBtn.addEventListener('click', () => {
    currentView = 'memory';
    updateNavUI();
    updateView();
  });
}

function updateNavUI() {
  const flashcardsNavBtn = document.getElementById('nav-flashcards');
  const memoryNavBtn = document.getElementById('nav-memory');

  if (currentView === 'flashcards') {
    flashcardsNavBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400';
    memoryNavBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all opacity-70 hover:opacity-100';
  } else {
    memoryNavBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400';
    flashcardsNavBtn.className = 'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all opacity-70 hover:opacity-100';
  }
}

function getFilteredWords() {
  if (currentCat === 'Todas') return allVocab;
  return allVocab.filter(w => w.cat === currentCat);
}

function updateView() {
  const words = getFilteredWords();
  const flashcardsViewEl = document.getElementById('flashcards-view');
  const memoryViewEl = document.getElementById('memory-view');

  if (currentView === 'flashcards') {
    flashcardsViewEl.classList.remove('hidden');
    memoryViewEl.classList.add('hidden');
    initFlashcards(words);
  } else {
    flashcardsViewEl.classList.add('hidden');
    memoryViewEl.classList.remove('hidden');
    initMemoryGame(words);
  }
}

document.addEventListener('DOMContentLoaded', loadData); 