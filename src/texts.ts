export const getLanguage = () => {
  const systemLang = process.env.LANG
  if (systemLang?.includes('en')) return "english"
  if (systemLang?.includes('es')) return "spanish"
  return 'english'
}

export const getTexts = () => {
  const language = getLanguage()

  const texts = {
    spanish: {
      intervalsLengthQuestion: 'Cuánto querés que tarden los intervalos?', 
      shortPauseQuestion: 'Cuánto querés que dure la pausa corta?', 
      howManyIntervals: 'Cada cuantos intervalos una pausa larga?',
      longPauseQuestion: 'Cuánto querés que dure la pausa corta?', 
      onLongPause: 'En pause larga',
      onShortPause: 'En pause corta',
      onInterval: 'En intervalo',
      completedIntervals: 'vueltas completas',
      paused: 'PAUSADO',
      minute: 'minuto',
      min: 'min',
      second: 'segundo',
      sec: 's',
    },
    english: {
      intervalsLengthQuestion: 'How long do you want the intervals to be?', 
      shortPauseQuestion: 'How long do you want the short pause to be?', 
      howManyIntervals: 'Every how many intervals a long pause?',
      longPauseQuestion: 'How long do you want the long pause to be?', 
      onLongPause: 'On long pause',
      onShortPause: 'On short pause',
      onInterval: 'On interval',
      completedIntervals: 'completed intervals',
      paused: 'ON PAUSE',
      minute: 'minute',
      min: 'min',
      second: 'second',
      sec: 's',
    }
  }

  return texts[language]
}