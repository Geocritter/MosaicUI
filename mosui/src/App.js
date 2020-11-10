// Dependables
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


// Components
import Home from './components/Home/Home';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
                <Switch>
                    <Route path='/' exact component={Home} />
                </Switch>
        </Router>
        
      </header>
    </div>
  );
}

export default App;
