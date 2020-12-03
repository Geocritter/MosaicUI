// Dependables
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


// Components
import Intro from './components/Intro/Intro';
import Home from './components/RingOfFire/Home/Home';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
                <Switch>
                    <Route path='/' exact component={Intro} />
                    <Route path='/mosui' exact component={Home} />
                </Switch>
        </Router>
        
      </header>
    </div>
  );
}

export default App;
