import { useState, Fragment, useEffect } from 'react';
import classes from './ModalBody.module.css';
import Timer from './Timer';

const ModalBody = (props) => {
    const [enteredCount, setEnteredCount] = useState('');
    const [countDown, setCountDown] = useState(0);
    const [showClock, setShowClock] = useState(true);
    let countdownTimer = null;

    const timerExpiredHandler = () => {
        setShowClock(false);
        props.onTimerExpired();
        // setClockTimerStarted(false);
        setCountDown(0);
        clearInterval(countdownTimer);
    };

    const enteredCountChangeHandler = (evt) => {
        setEnteredCount(evt.target.value);
    };
    

    const { countdownStarted } = props;
    // THIS WILL CREATE A NEW TIMER EVERY TIME COUNTDOWNSTARTED CHANGES
    useEffect(() => {
        if (countdownStarted) {
            setShowClock(true);
            countdownTimer = setInterval(() => {
                if (countdownStarted) {
                    setCountDown(prevState => {

                        // If we've got to the end, start the real clock
                        if (prevState === 3) {
                            // console.log('About to fire onTimerStarted')
                            // props.onTimerStarted();
                            // console.log('done')
                        }
                        
                        // If we haven't then move on
                        if (prevState !== 4) {
                            return prevState + 1;
                        } else {
                            clearInterval(countdownTimer);
                            return prevState;
                        }
                    });
                }   
            }, 1000);
        }

        return () => {
            clearInterval(countdownTimer);
            setCountDown(0);
        };
    }, [countdownStarted]);


    useEffect(() => {
        console.log('countdown changed ' + countDown)
        if (countDown === 4) {
            props.onTimerStarted();
        }
    }, [countDown])

    const countDownLabels = ['Get Ready!', '3', '2', '1', 'Go!'];

    return (
        <Fragment>
            {showClock && <Timer start={60} started={props.clockTimerStarted} onTimerExpired={timerExpiredHandler} />}
            {!showClock && (
                <div className={classes['count-field-container']}>
                    <label>How many did you get?</label>
                    <input type='text' onChange={enteredCountChangeHandler} />        
                </div>
            )}
            <div className={`${classes['countdown']} ${props.countdownStarted ? classes['animate-countdown'] : ''}` }>{countDownLabels[countDown]}</div>
        </Fragment>
    )
};

export default ModalBody;