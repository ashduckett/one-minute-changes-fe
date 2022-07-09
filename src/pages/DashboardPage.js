import React from 'react';
import { useSelector } from 'react-redux'; 

import ResultsGrid from '../components/ResultsGrid';

const DashboardPage = () => {
    return (
        <React.Fragment>
            <ResultsGrid />
        </React.Fragment>
    );
};

export default DashboardPage;
