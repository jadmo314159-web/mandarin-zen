export function playTTS(text) {
  // Cancelar cualquier síntesis de voz anterior por si acaso
  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

  // URL del TTS de Google Translate para chino mandarín (zh-CN)
  const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`;
  
  // Usamos un proxy CORS público para permitir que el navegador reproduzca el audio externo sin bloqueos
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(googleTTSUrl)}`;

  const audio = new Audio(proxyUrl);
  audio.playbackRate = 0.9; // Velocidad ligeramente más lenta para estudiantes

  audio.play().catch(error => {
    console.warn("No se pudo reproducir el audio externo, usando voz del sistema como respaldo:", error);
    fallbackSpeechSynthesis(text);
  });
}

// Función de respaldo por si falla la red o el proxy
function fallbackSpeechSynthesis(text) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
} 