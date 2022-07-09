import { Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout/Layout';
import { useSelector } from 'react-redux';


function App() {
  const user = useSelector(state => state.user);
  
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
