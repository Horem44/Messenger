import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Messenger from './pages/Messenger/Messenger';

function App() {
  return (
    <div className="App">
      <Header/>
      <Messenger/>
    </div>
  );
}

export default App;
