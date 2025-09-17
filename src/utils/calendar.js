export function getGoogleCalendarUrl(task) {
  const title = encodeURIComponent(task.title);
  const details = encodeURIComponent(`Tarefa: ${task.title}`);
  const [h, m] = task.hora.split(':');
  const now = new Date();
  // Cria a data/hora de início do evento usando a data de hoje e a hora da tarefa
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  // Cria a data/hora de término do evento, 15 minutos após o início
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  // Função para formatar a data no padrão exigido pelo Google Calendar (YYYYMMDDTHHmmssZ)
  const fmt = d => d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}`;
}
