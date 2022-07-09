import { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import classes from './ModalBody.module.css';
import Timer from './Timer';

const ModalBody = (props) => {
    const [countDown, setCountDown] = useState(0);
    const [showClock, setShowClock] = useState(true);
    let countdownTimer = useRef();

    const { onTimerExpired, countdownStarted, onTimerStarted } = props;


    const timerExpiredHandler = useCallback(() => {
        setShowClock(false);
        onTimerExpired();
        setCountDown(0);
        clearInterval(countdownTimer);
    }, [onTimerExpired, countdownTimer]);

    const enteredCountChangeHandler = (evt) => {
        props.onCountEntered(evt.target.value);
    };

    useEffect(() => {
        if (countdownStarted) {
            setShowClock(true);
            countdownTimer.current = setInterval(() => {
                if (countdownStarted) {
                    setCountDown(prevState => {
                        // If we haven't then move on
                        if (prevState !== 60) {
                            return prevState + 1;
                        } else {
                            clearInterval(countdownTimer.current);
                            return prevState;
                        }
                    });
                }   
            }, 1000);
        }

        return () => {
            clearInterval(countdownTimer.current);
            setCountDown(0);
        };
    }, [countdownStarted]);


    useEffect(() => {
        if (countDown === 4) {
            onTimerStarted();
        }
    }, [countDown, onTimerStarted])

    const countDownLabels = ['Get Ready!', '3', '2', '1', 'Go!'];

    let label = '';

    if (countDown < 4) {
        label = countDownLabels[countDown];
    } else {
        label = countDown % 2 ? props.fromChordName : props.toChordName;
    }

    return (
        <Fragment>
            {showClock && <Timer start={60} running={props.clockTimerStarted} onTimerExpired={timerExpiredHandler} />}
            {!showClock && (
                <div className={classes['count-field-container']}>
                    <label>How many did you get?</label>
                    <input type='text' onChange={enteredCountChangeHandler} />        
                </div>
            )}
            <div className={`${classes['countdown']} ${props.countdownStarted ? classes['animate-countdown'] : ''}` }>{label}</div>
        </Fragment>
    )
};

export default ModalBody;