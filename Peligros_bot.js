// Importar la librería
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
// Token del bot de Telegram
const token = '6789536819:AAEoSbo_AC6pVVdHSvc_hmRkVbyingipbyY';
// URL de la API de fútbol
const apiUrl = 'https://api.football-data.org/v4/matches';
// Crear una instancia del bot de Telegram
const bot = new TelegramBot(token, { polling: true });
// Manejar el comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hola, bienvenido a Peligros_bot. Para más información utilice el comando /help.');
});
// Manejar el comando /resultados
bot.onText(/\/resultados/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // Realizar la consulta a la API de resultados
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Auth-Token': 'e22e57b565854afe800fc42df352f753', // Token de la API
      },
    });
    // Procesar la respuesta de la API y construir el mensaje de resultados
    const resultados = response.data.matches;
    const mensajeResultados = resultados.map((partido) => {
      const equipoLocal = partido.homeTeam.name;
      const equipoVisitante = partido.awayTeam.name;
      const resultado = `${equipoLocal} ${partido.score.fullTime.home} - ${partido.score.fullTime.away} ${equipoVisitante}`;
      return resultado;
    }).join('\n');
    // Mostrar el mensaje de resultados al usuario
    bot.sendMessage(chatId, `Resultados de los partidos de fútbol:\n${mensajeResultados}`);
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    bot.sendMessage(chatId, 'Lo siento, ha ocurrido un error al obtener los resultados.');
  }
});
// Manejar el comando /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  // Mostrar una lista de comandos disponibles
  const ayudaMensaje = `
    Buenas, este bot contiene datos sobre fútbol, debajo encontrará más información.
    - Lista de comandos disponibles:
    /start - Inicia una conversación con el bot.
    /help - Muestra la lista de comandos disponibles y su explicación.
    /resultados - Muestra los resultados de los partidos de fútbol del día de hoy.
    /borrar - Borra los dos últimos mensajes en la conversación con el bot.
    /ligas - Muestra la lista de ligas disponibles a las que se puede pedir información.
    /tabla [código de liga] - Muestra la tabla de posiciones de una liga específica.
  `;
  bot.sendMessage(chatId, ayudaMensaje);
});
// Manejar el comando /borrar
bot.onText(/\/borrar/, (msg) => {
  const chatId = msg.chat.id;
  // Utilizar el método deleteMessage para borrar los dos últimos mensajes en la conversación
  for (let i = 0; i < 2; i++) {
    bot.deleteMessage(chatId, msg.message_id - i);
  }
});
// Manejar el comando /ligas
bot.onText(/\/ligas/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // Realizar la consulta a la API para obtener la lista de todas las ligas disponibles
    const response = await axios.get('https://api.football-data.org/v4/competitions', {
      headers: {
        'X-Auth-Token': 'e22e57b565854afe800fc42df352f753', // Token de la API
      },
    });
    // Procesar la respuesta de la API y construir el mensaje de ligas
    const ligas = response.data.competitions;
    const mensajeLigas = ligas.map((liga) => {
      return `${liga.name} (${liga.code}) - Emblema: ${liga.emblem}`;
    }).join('\n');
    // Mostrar el mensaje de ligas al usuario
    bot.sendMessage(chatId, `Lista de ligas disponibles:\n${mensajeLigas}`);
  } catch (error) {
    console.error('Error al obtener la lista de ligas:', error);
    bot.sendMessage(chatId, 'Lo siento, ha ocurrido un error al obtener la lista de ligas.');
  }
});
// Manejar el comando /tabla [código de liga]
bot.onText(/\/tabla (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const leagueCode = match[1]; // Capturar el código de la liga proporcionado
  try {
    // Realizar la consulta a la API para obtener la tabla de posiciones de una liga específica
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`, {
      headers: {
        'X-Auth-Token': 'e22e57b565854afe800fc42df352f753', // Token de la API
      },
    });
    // Procesar la respuesta de la API y construir el mensaje de tabla de posiciones
    const grupos = response.data.standings;
    let mensajeTabla = '';
    grupos.forEach((grupo, index) => {
      const tablaPosiciones = grupo.table;
      mensajeTabla += `Tabla de posiciones del grupo ${String.fromCharCode(65 + index)}:\n`;
      mensajeTabla += tablaPosiciones.map((equipo) => {
        return `${equipo.position}. ${equipo.team.name} - Pts: ${equipo.points}, PJ: ${equipo.playedGames}, DG: ${equipo.goalDifference}`;
      }).join('\n');
      mensajeTabla += '\n\n';
    });
    // Mostrar el mensaje de la tabla al usuario
    bot.sendMessage(chatId, mensajeTabla);
  } catch (error) {
    console.error('Error al obtener la tabla de posiciones:', error);
    bot.sendMessage(chatId, 'Lo siento, ha ocurrido un error al obtener la tabla de posiciones.');
  }
});