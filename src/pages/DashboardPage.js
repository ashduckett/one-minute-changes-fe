import React from 'react';
import { useSelector } from 'react-redux'; 

const DashboardPage = () => {
    const user = useSelector((state) => {
        return state.user;
    });

    const results = useSelector(state => {
        return state.results;
    });

    let resultRows = [];
    if (results) {
        console.log(results)
        const vLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        for (const [index, row] of results.entries()) {
            let currentRow = [];
            console.log(row)
            
            currentRow.push(<div className='label-item'>{vLabels[index]}</div>);
            for (const col of row) {
                currentRow.push(<div className='result-item'>{col.count}</div>);
            }
            
            resultRows.push(<div className='result-row'>{currentRow}</div>);
        }
        
        let labelRow = [];
        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        for (let i = 0; i < 7; i++) {
            labelRow.push(<div className='label-item'>{labels[i]}</div>);
        }

        resultRows.push(<div className='label-row'>{labelRow}</div>)
    }
    
    return (
        <React.Fragment>
            <div>Welcome {user.first_name}</div>
            <div className='results-container'>
                <div className="results">
                    {resultRows}        
                </div>
            </div>
        </React.Fragment>


    );
};

export default DashboardPage;