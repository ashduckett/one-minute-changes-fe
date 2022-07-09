import classes from './Timer.module.css';
import { useEffect, useState, useRef } from 'react';
import { formatTime, COLOUR_CODES } from '../Utils';
import React from 'react';
const Timer = (props) => {
    const [circleDashArrayValue, setCircleDashArrayValue] = useState('283 283');
    // const [instantTransitions, setInstantTransitions] = useState(false);
    const [colourClass, setColourClass] = useState(classes[COLOUR_CODES.info.colour]);
    const [timePassed, setTimePassed] = useState(0);
    const beatingHeart = useRef();

    const FULL_DASH_ARRAY = 283;

    const { running, start, onTimerExpired } = props;
    
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

    useEffect(() => {
        if (running && timePassed < 60) {
            beatingHeart.current = setTimeout(() => {
                setTimePassed(prevTimePassed => prevTimePassed + 1);
                const timeLeft = start - timePassed;
                const rawTimeFraction = timeLeft / start;
                const timeFraction = rawTimeFraction - (1 / start) * (1 - rawTimeFraction);
                const circleDasharray = `${(timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
                setCircleDashArrayValue(circleDasharray);
                setRemainingPathColor(timeLeft);
            }, 200);
        } else {
            if (timePassed !== 60) {
                clearInterval(beatingHeart.current);
                setTimePassed(0);
                const timeLeft = start - timePassed;
                const rawTimeFraction = timeLeft / start;
                const timeFraction = rawTimeFraction - (1 / start) * (1 - rawTimeFraction);
                const circleDasharray = `${(timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
                setCircleDashArrayValue(circleDasharray);
                setRemainingPathColor(timeLeft);
            } else {
                clearInterval(beatingHeart.current);
                onTimerExpired();
            }
        }

        return () => {
            clearInterval(beatingHeart.current);
        };
    }, [running, start, timePassed, onTimerExpired]);

    return (
        <div className={classes['base-timer']}>
            <svg className={classes['base-timer__svg']} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className={classes['base-timer__circle']}>
                    <circle className={classes['base-timer__path-elapsed']} cx="50" cy="50" r="45" />
                    <path id="base-timer-path-remaining" strokeDasharray={circleDashArrayValue} className={`${classes['base-timer__path-remaining']} ${colourClass}`} d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path>
                </g>
            </svg>
            <span className={classes['base-timer__label']}>
                {formatTime(props.start - timePassed)}
            </span>
        </div>
    );
};

export default React.memo(Timer);