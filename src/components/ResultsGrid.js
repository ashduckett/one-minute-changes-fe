import { useSelector, useDispatch } from 'react-redux'; 
import { useState } from 'react';
import Modal from './UI/Modal';
import ModalBody from './ModalBody';


const ResultsGrid = () => {
    const [changeUserId, setChangeUserId] = useState();
    const [chordChange, setChordChange] = useState();
    const [countdownStarted, setCountDownStarted] = useState(false);
    const [clockTimerStarted, setClockTimerStarted] = useState(false);

    const dispatch = useDispatch();

    const chordSelected = (userId, chordChange) => {
        setChangeUserId(userId);
        setChordChange(chordChange);
        dispatch({ type: 'MODAL_TOGGLED' });
    };

    const results = useSelector(state => {
        return state.results;
    });

    const modalOpen = useSelector(state => state.modalOpen);
    
    const timerExpiredHandler = () => {
        setCountDownStarted(false);
    };

    const clockStartedHandler = () => {
        console.log('Updating started state');
        setClockTimerStarted(true);
    };

    const chordChangeLogModalActions = [
        {
            text: countdownStarted ? 'Restart' : 'Start Timer',
            action: () => {
                if (!countdownStarted) {
                    setCountDownStarted(true);
                } else {
                    setCountDownStarted(false);
                    // setClockTimerStarted(false);
                }

                if (clockTimerStarted) {
                    setClockTimerStarted(false);
                }
            }
        },
        
        {
            text: 'Send',
            action: () => {
                //console.log(chordChange, changeUserId, enteredCount)

            }
        },
        {
            text: 'Cancel',
            action: () => {
                dispatch({ type: 'MODAL_TOGGLED' });
            }
        }
    ];



    // const ModalBody = () => {
        // const [clockTimer, setClockTimer] = useState(60);
        // const [countDown, setCountDown] = useState(0);
        

        // const startCountDownHandler = () => {
        //     console.log('f')
            
            
            
        //     const countDownTimer = setInterval(() => {
        //         console.log(countDown)
        //         setCountDown(prevState => {
                    
        //             if (prevState !== 3) {
        //                 return prevState + 1;
        //             } else {
        //                 clearInterval(countDownTimer);
        //                 return prevState
        //             }
        //         });
                   
        //     }, 1000);

        // };

        // const countDownLabels = ['3', '2', '1', 'Go!'];

        // return (
        //     <Fragment>
        //         <h1>Hello</h1>
        //         <div>{clockTimer}</div>
        //         <button onClick={startCountDownHandler}>Start Clock</button>
        //         <div>{countDownLabels[countDown]}</div>
        //         <input type='text' onChange={enteredCountChangeHandler} />
        //         <button></button>
        //     </Fragment>
        // )
    // };


    let resultRows = [];
    if (results) {


        const vLabels = ['D', 'E', 'Am', 'Em', 'Dm', 'G', 'C'];

        for (const [index, row] of results.entries()) {
            let currentRow = [];
            
            currentRow.push(<div className='label-item'>{vLabels[index]}</div>);
            for (const col of row) {
                currentRow.push(<div onClick={() => {chordSelected(col.user_id, col.chord_change)}} className='result-item'>{col.count}</div>);
            }
            
            resultRows.push(<div className='result-row'>{currentRow}</div>);
        }
        
        let labelRow = [];
        const labels = ['A', 'D', 'E', 'Am', 'Em', 'Dm', 'G'];
        for (let i = 0; i < 7; i++) {
            labelRow.push(<div className='label-item'>{labels[i]}</div>);
        }

        resultRows.push(<div className='label-row'>{labelRow}</div>)
    }

    return (
        <div className='results-container'>
            <div className="results">
                {resultRows}        
            </div>
            {modalOpen && (
                <Modal actions={chordChangeLogModalActions}>
                    <ModalBody countdownStarted={countdownStarted} onTimerExpired={timerExpiredHandler} onTimerStarted={clockStartedHandler} clockTimerStarted={clockTimerStarted} />
                </Modal> 
            )}
        </div>
    );
};

export default ResultsGrid;