const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6789536819:AAEoSbo_AC6pVVdHSvc_hmRkVbyingipbyY';
const apiUrl = 'https://api.football-data.org/v4/matches'; // Reemplaza con la URL de la API que estás utilizando

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hola, bienvenido a Peligros_bot. Puedes usar comandos como /resultados para obtener información sobre los partidos de fútbol.');
});

bot.onText(/\/resultados/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Realizar la consulta a la API de resultados
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Auth-Token': 'e22e57b565854afe800fc42df352f753', // Reemplaza con tu token de la API
      },
    });
    
    // Aquí deberías procesar la respuesta de la API y construir el mensaje de respuesta al usuario
    const resultados = response.data.matches;

    // Construir un mensaje con los resultados de los partidos
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
