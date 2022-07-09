export const formatTime = (time) => {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(time / 60);
    
    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;
    
    // If the value of seconds is less than 10, then display seconds with a leading zero
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
  
    // The output in MM:SS format
    return `${minutes}:${seconds}`;
}

const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 15;

export const COLOUR_CODES = {
    info: {
        colour: 'green'
    },
    warning: {
        colour: 'orange',
        threshold: WARNING_THRESHOLD
    },
    alert: {
        colour: 'red',
        threshold: ALERT_THRESHOLD
    }
};