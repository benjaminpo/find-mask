import React from 'react';
import './App.css';
import Foot from './components/Foot';
import Map from './components/Map';
import {
  BrowserRouter as Router,
  // Switch,
  // Route,
  // Link,
  // useRouteMatch,
  // useParams
} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Map />
        <Foot />
      </div>
    </Router>
  );
}

export default App;
