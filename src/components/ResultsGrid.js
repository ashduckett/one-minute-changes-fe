import { useSelector, useDispatch } from 'react-redux'; 
import { useState, useCallback, useEffect } from 'react';
import { logIn, appActions } from '../store/app-slice';
import Modal from './UI/Modal';
import ModalBody from './ModalBody';
import { getCookie, baseUrl } from '../API';
import { useNavigate } from 'react-router-dom';

const ResultsGrid = () => {
    const [chordChangeUserId, setChordChangeUserId] = useState();
    const [chordChange, setChordChange] = useState();
    const [countdownStarted, setCountDownStarted] = useState(false);
    const [clockTimerStarted, setClockTimerStarted] = useState(false);
    const [enteredCount, setEnteredCount] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const chordSelected = (userId, chordChange) => {
        setChordChangeUserId(userId);
        setChordChange(chordChange);
        dispatch(appActions.modalToggled());
    };

    // Store the entered count
    const countEnteredHandler = enteredCount => {
        setEnteredCount(enteredCount);
    };

    // 
    const modalClosedHandler = () => {
        setCountDownStarted(false);
        setClockTimerStarted(false);
        dispatch(appActions.modalToggled());
    };

    const results = useSelector(state => {
        return state.results;
    });

    const modalOpen = useSelector(state => state.modalOpen);
    
    const timerExpiredHandler = useCallback(() => {
        setCountDownStarted(false);
    }, []);

    const clockStartedHandler = () => {
        setClockTimerStarted(true);
    };

    useEffect(() => {
        const setupData = async () => {
            const csrfCookie = getCookie('XSRF-TOKEN');

            // If there is a cookie but no results, it means the user has typed the URL which means we need to
            // get the data again
            if (csrfCookie && !results) {
                dispatch(logIn());
            } else {
                
                // If there are no results and no cookie can be used to get them the user is logged out so redirect them.
                if (!results && !csrfCookie) {
                    navigate('/login', { replace: true });
                }
            }
        
        };
        setupData();

    }, [dispatch, navigate, results]);


    const chordChangeLogModalActions = [
        {
            text: countdownStarted ? 'Restart' : 'Start Timer',
            action: () => {
                if (!countdownStarted) {
                    setCountDownStarted(true);
                } else {
                    setCountDownStarted(false);
                }

                if (clockTimerStarted) {
                    setClockTimerStarted(false);
                }
            }
        },
        
        {
            text: 'Send',
            action: () => {
                const submitObj = {
                    chordChangeId: chordChange.id,
                    count: enteredCount,
                    userId: chordChangeUserId
                };
                
                const XSRF_TOKEN = getCookie('XSRF-TOKEN');
                // Would be nice to use an action creator thunk for this
                fetch(`${baseUrl}/api/user/change`, {
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify(submitObj),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': XSRF_TOKEN          // Why do I need to use this here but not in the get request getting user chord changes?
                    }
                }).then(() => {
                    dispatch(appActions.resultIssued({ chordChangeId: submitObj.chordChangeId, userId: submitObj.userId, count: submitObj.count }));
                    dispatch(appActions.modalToggled());
                    setCountDownStarted(false);
                    setClockTimerStarted(false);
                });
            }
        },
        {
            text: 'Cancel',
            action: () => {
                modalClosedHandler();
            }
        }
    ];

    let resultRows = [];

    if (results) {
        const vLabels = ['D', 'E', 'Am', 'Em', 'Dm', 'G', 'C'];
        for (const [index, row] of results.entries()) {
            let currentRow = [];
            
            currentRow.push(<div key={`vlabel-${index}`} className='label-item'>{vLabels[index]}</div>);
            for (const col of row) {
                currentRow.push(<div key={`col-${col.chord_change_id}`} onClick={() => {chordSelected(col.user_id, col.chord_change)}} className='result-item'>{col.count}</div>);
            }
            
            resultRows.push(<div key={`row-${index}`} className='result-row'>{currentRow}</div>);
        }
        
        let labelRow = [];
        const labels = ['A', 'D', 'E', 'Am', 'Em', 'Dm', 'G'];
        for (let i = 0; i < 7; i++) {
            labelRow.push(<div key={`hlabel-${i}`} className='label-item'>{labels[i]}</div>);
        }

        resultRows.push(<div key='label-row' className='label-row'>{labelRow}</div>)
    }

    return (
        <div className='results-container'>
            <div className="results">
                {resultRows}        
            </div>
            {modalOpen && (
                <Modal actions={chordChangeLogModalActions} onModalClosed={modalClosedHandler}>
                    <ModalBody 
                        countdownStarted={countdownStarted} 
                        onTimerExpired={timerExpiredHandler} 
                        onTimerStarted={clockStartedHandler} 
                        clockTimerStarted={clockTimerStarted} 
                        fromChordName={chordChange.from_chord.name}
                        toChordName={chordChange.to_chord.name}
                        onCountEntered={countEnteredHandler}
                    />
                </Modal> 
            )}
        </div>
    );
};

export default ResultsGrid;