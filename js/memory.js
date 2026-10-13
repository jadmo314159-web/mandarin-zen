import { playTTS } from './tts.js';

export function initMemoryGame(words) {
  let gameMode = 'char'; // 'char' | 'sound' | 'pinyin'
  let cards = [];
  let selectedIds = [];
  let isLocked = false;
  let isVictory = false;

  const container = document.getElementById('memory-view');
  if (!container) return;

  function initializeGame() {
    if (!words || words.length === 0) {
      container.innerHTML = `<p class="text-center text-slate-500 py-12">No hay suficientes palabras para iniciar el juego.</p>`;
      return;
    }

    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, Math.min(6, words.length));

    const deck = [];
    selectedWords.forEach((word) => {
      deck.push({
        id: Math.random().toString(),
        type: 'prompt',
        matchId: word.c,
        word: word,
        isRemoving: false
      });
      deck.push({
        id: Math.random().toString(),
        type: 'meaning',
        matchId: word.c,
        word: word,
        isRemoving: false
      });
    });

    cards = deck.sort(() => 0.5 - Math.random());
    selectedIds = [];
    isLocked = false;
    isVictory = false;
    render();
  }

  function render() {
    container.innerHTML = `
      <div class="flex flex-col items-center">
        <!-- SELECTOR DE MODOS -->
        <div class="w-full max-w-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4 px-2">
          <div class="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl md:rounded-full w-full md:w-auto overflow-x-auto scrollbar-hide snap-x">
            <button data-mode="char" class="mode-btn flex items-center justify-center flex-1 md:flex-none gap-2 px-4 py-2 rounded-xl md:rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start ${gameMode === 'char' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' : 'opacity-70 hover:opacity-100'}">
              Símbolo
            </button>
            <button data-mode="sound" class="mode-btn flex items-center justify-center flex-1 md:flex-none gap-2 px-4 py-2 rounded-xl md:rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start ${gameMode === 'sound' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' : 'opacity-70 hover:opacity-100'}">
              Sonido
            </button>
            <button data-mode="pinyin" class="mode-btn flex items-center justify-center flex-1 md:flex-none gap-2 px-4 py-2 rounded-xl md:rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start ${gameMode === 'pinyin' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' : 'opacity-70 hover:opacity-100'}">
              Pinyin
            </button>
          </div>

          <button id="restart-game-btn" class="flex items-center justify-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800/60 transition font-medium text-sm w-full md:w-auto">
            Reiniciar
          </button>
        </div>

        <!-- GRID -->
        ${!isVictory ? `
          <div class="grid grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl transition-all duration-500" id="cards-grid">
            ${cards.map(card => {
              const isSelected = selectedIds.includes(card.id);
              let contentHtml = '';

              if (card.type === 'meaning') {
                contentHtml = `<span class="text-xs sm:text-sm md:text-xl font-medium text-slate-700 dark:text-slate-200 leading-tight px-1 break-words">${card.word.m}</span>`;
              } else {
                if (gameMode === 'char') {
                  contentHtml = `
                    <span class="text-3xl sm:text-4xl md:text-6xl font-medium text-slate-800 dark:text-white mb-1 sm:mb-2 tracking-tight break-words max-w-full">${card.word.c}</span>
                    <span class="text-xs sm:text-sm md:text-base text-teal-600 dark:text-teal-400 px-1 truncate max-w-full">${card.word.p}</span>
                  `;
                } else if (gameMode === 'sound') {
                  contentHtml = `
                    <div class="flex flex-col items-center gap-2 sm:gap-3">
                      <div class="p-3 sm:p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full text-teal-600 dark:text-teal-400">
                        <svg width="28" height="28" class="sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                      </div>
                      <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-teal-600/70 dark:text-teal-400/70">Escuchar</span>
                    </div>
                  `;
                } else if (gameMode === 'pinyin') {
                  contentHtml = `<span class="text-lg sm:text-2xl md:text-4xl font-light text-teal-600 dark:text-teal-400 tracking-wider px-1 break-words max-w-full">${card.word.p}</span>`;
                }
              }

              return `
                <div 
                  data-id="${card.id}"
                  class="memory-card relative aspect-[4/5] cursor-pointer transition-all duration-300 transform ${card.isRemoving ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'} ${isSelected ? 'scale-105 shadow-lg ring-4 ring-teal-400 ring-offset-2 dark:ring-offset-slate-900 z-10' : 'hover:scale-105 hover:shadow-md z-0'}"
                >
                  <div class="w-full h-full rounded-xl md:rounded-2xl shadow-sm border flex flex-col items-center justify-center p-1.5 sm:p-2 text-center transition-colors duration-200 overflow-hidden ${card.type === 'prompt' ? 'bg-white dark:bg-slate-700 border-teal-200 dark:border-teal-900/50' : 'bg-teal-50 dark:bg-slate-800 border-teal-100 dark:border-slate-600'} ${isSelected ? 'bg-teal-50 dark:bg-slate-600' : ''}">
                    ${contentHtml}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- VICTORIA -->
        ${isVictory ? `
          <div class="mt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div class="bg-teal-100 dark:bg-teal-900/50 p-4 rounded-full mb-4 text-teal-600 dark:text-teal-400">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">¡Nivel Superado!</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-6">Has emparejado todas las palabras correctamente.</p>
            <button id="next-round-btn" class="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Siguiente Ronda
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Listeners
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        gameMode = e.currentTarget.getAttribute('data-mode');
        initializeGame();
      });
    });

    document.getElementById('restart-game-btn')?.addEventListener('click', initializeGame);
    document.getElementById('next-round-btn')?.addEventListener('click', initializeGame);

    document.querySelectorAll('.memory-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const id = cardEl.getAttribute('data-id');
        handleCardClick(id);
      });
    });
  }

  function handleCardClick(id) {
    if (isLocked || selectedIds.includes(id)) return;

    const clickedCard = cards.find(c => c.id === id);

    if (clickedCard.type === 'prompt' && (gameMode === 'char' || gameMode === 'sound')) {
      playTTS(clickedCard.word.c);
    }

    const newSelected = [...selectedIds, id];
    selectedIds = newSelected;
    render();

    if (newSelected.length === 2) {
      isLocked = true;
      const card1 = cards.find(c => c.id === newSelected[0]);
      const card2 = cards.find(c => c.id === newSelected[1]);

      if (card1.matchId === card2.matchId) {
        setTimeout(() => {
          cards = cards.map(c => newSelected.includes(c.id) ? { ...c, isRemoving: true } : c);
          render();

          setTimeout(() => {
            cards = cards.filter(c => !newSelected.includes(c.id));
            if (cards.length === 0) isVictory = true;
            selectedIds = [];
            isLocked = false;
            render();
          }, 300);
        }, 500);
      } else {
        setTimeout(() => {
          selectedIds = [];
          isLocked = false;
          render();
        }, 600);
      }
    }
  }

  initializeGame();
} 