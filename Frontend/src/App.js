import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Remove the extra space here
import './App.css';
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import PathFinderMainPage from './Pages/PathFinderMainPage';

import { useAuthContext } from './Hooks/useAuthContext';
function App() {
  const {user} = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path = '/user/login' element={!user ? <LoginPage/> : <Navigate to= '/pathfinder'/>} />
          <Route exact path = '/user/signup' element={!user ? <SignupPage/> : <Navigate to= '/pathfinder'/>} />
          <Route exact path = '/' element={user? <PathFinderMainPage/>: <Navigate to= '/user/login'/>}/>
          <Route exact path = '/pathfinder' element={<PathFinderMainPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
