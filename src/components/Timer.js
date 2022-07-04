import classes from './Timer.module.css';
import { useEffect, useState } from 'react';

    // Warning occurs at 10s
    const WARNING_THRESHOLD = 30;

    // Alert occurs at 5s
    const ALERT_THRESHOLD = 15;

    const COLOUR_CODES = {
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

const Timer = (props) => {
    let timerInterval = null;
    const [circleDashArrayValue, setCircleDashArrayValue] = useState('283 283');
    const [instantTransitions, setInstantTransitions] = useState(false);


    
    const [colourClass, setColourClass] = useState(classes[COLOUR_CODES.info.colour]);

    const TIME_LIMIT = props.start;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    const FULL_DASH_ARRAY = 283;
    


    function setRemainingPathColor(timeLeft) {
        const { alert, warning } = COLOUR_CODES;

        // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
        if (timeLeft <= alert.threshold) {
            setColourClass(classes[alert.colour]);
      
        // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
        } else if (timeLeft <= warning.threshold) {
            setColourClass(classes[warning.colour])
        }
    }

    // Divides time left by the defined time limit.
    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / props.start;
        return rawTimeFraction - (1 / props.start) * (1 - rawTimeFraction);
    }
      
    // Update the dasharray value as time passes, starting with 283
    function setCircleDasharray() {
        const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
        
        
        setCircleDashArrayValue(circleDasharray);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            console.log('timer fired')
            console.log(timePassed)
            // The amount of time passed increments by one
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
          
            // The time left label is updated
            setTimerValue(formatTime(timeLeft));
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
            // setColourClass(COLOUR_CODES.info.colour);

            // This timer should be cancelled if either it has finished, or if it has been cancelled

            if (timePassed === props.start) {
                props.onTimerExpired();
                clearInterval(timerInterval)
            }
        }, 200);

        return timerInterval;
    }

    function formatTime(time) {
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


    const [timerValue, setTimerValue] = useState(formatTime(timeLeft));

    // When the started prop changes we'll either start the clock or stop it
    useEffect(() => {
        let timerInterval;
        if (props.started) {
            setInstantTransitions(false);
            timerInterval = startTimer();
        } else {
            clearInterval(timerInterval);
            setTimerValue(formatTime(props.start));
            
            
            // How can I acheive this without refs? Can I acheive it without refs?
            console.log('setting extra classes')
            setInstantTransitions(true);
            setCircleDasharray();
            setColourClass(COLOUR_CODES.info.colour);
        }   

        return () => {
            clearInterval(timerInterval);
        };
    }, [props.started]);
    
    return (
        <div className={classes['base-timer']}>
            
            <svg className={classes['base-timer__svg']} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className={classes['base-timer__circle']}>
                    <circle className={classes['base-timer__path-elapsed']} cx="50" cy="50" r="45" />
                    <path id="base-timer-path-remaining" strokeDasharray={circleDashArrayValue} className={`${classes['base-timer__path-remaining']} ${colourClass} ${instantTransitions ? classes['instant-transition'] : ''}`} d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path>
                </g>
            </svg>
            <span className={classes['base-timer__label']}>
                {timerValue} <div className='startedval'>{props.started}</div>
            </span>
        </div>
    );
};

export default Timer;