// utils/native.js
// Funções utilitárias usando APIs nativas do navegador

// 1. Obter localização do usuário
export async function getUserLocation() {
  if (!navigator.geolocation) return null;
  try {
    return await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
        err => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  } catch {
    return null;
  }
}

// 2. Exportar tarefas em JSON
export function exportTasksToJson(tasks) {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks-export-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 3. Copiar detalhes da tarefa para clipboard
export async function copyTaskToClipboard(task) {
  const text = `Tarefa: ${task.title}\nHora: ${task.hora || ''}\nConcluída: ${task.done ? 'Sim' : 'Não'}${task.location ? `\nLocalização: ${task.location.lat}, ${task.location.lng}` : ''}`;
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// 4. Adicionar tarefa por voz
export function listenTaskByVoice(onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError && onError('Reconhecimento de voz não suportado');
    return null;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  recognition.onerror = (event) => {
    onError && onError(event.error);
  };
  recognition.start();
  return recognition;
}
