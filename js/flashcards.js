import { playTTS } from './tts.js';

export function initFlashcards(words) {
  let currentIndex = 0;
  let isFlipped = false;

  const container = document.getElementById('flashcards-view');
  if (!container) return;

  function render() {
    if (!words || words.length === 0) {
      container.innerHTML = `<p class="text-center text-slate-500 py-12">No hay palabras disponibles en esta categoría.</p>`;
      return;
    }

    const currentWord = words[currentIndex];

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center space-y-10">
        <div class="w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000" id="card-element">
          <div class="relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}" id="card-inner">
            
            <!-- FRENTE -->
            <div class="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-8">
              <button id="tts-btn" class="absolute top-6 right-6 p-3 bg-teal-50 dark:bg-slate-700 text-teal-600 dark:text-teal-400 rounded-full hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              </button>
              <div class="flex-1 flex flex-col items-center justify-center">
                <h2 class="text-8xl md:text-9xl font-medium text-slate-800 dark:text-slate-100 mb-6 drop-shadow-sm">
                  ${currentWord.c}
                </h2>
                <p class="text-3xl text-teal-600 dark:text-teal-400 font-light tracking-widest">
                  ${currentWord.p}
                </p>
              </div>
              <p class="text-sm text-slate-400 dark:text-slate-500 mt-auto uppercase tracking-widest">
                Toca para girar
              </p>
            </div>

            <!-- DORSO -->
            <div class="absolute w-full h-full backface-hidden rotate-y-180 bg-teal-50 dark:bg-slate-800 rounded-3xl shadow-xl border border-teal-100 dark:border-slate-700 flex flex-col items-center justify-center p-8">
              <div class="text-center">
                <p class="text-sm font-medium text-teal-600/60 dark:text-teal-400/60 uppercase tracking-widest mb-4">
                  Significado
                </p>
                <h2 class="text-4xl md:text-5xl font-medium text-slate-800 dark:text-slate-100">
                  ${currentWord.m}
                </h2>
              </div>
            </div>

          </div>
        </div>

        <div class="flex items-center gap-8">
          <button id="prev-btn" class="p-4 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="text-lg font-medium text-slate-500 dark:text-slate-400 font-mono">
            ${currentIndex + 1} / ${words.length}
          </span>
          <button id="next-btn" class="p-4 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    // Eventos
    document.getElementById('card-element').addEventListener('click', () => {
      isFlipped = !isFlipped;
      document.getElementById('card-inner').classList.toggle('rotate-y-180', isFlipped);
    });

    document.getElementById('tts-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      playTTS(currentWord.c);
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
      isFlipped = false;
      setTimeout(() => {
        currentIndex = (currentIndex - 1 + words.length) % words.length;
        render();
      }, 150);
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      isFlipped = false;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;
        render();
      }, 150);
    });
  }

  render();
} 