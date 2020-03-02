import React from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.scss';
import PhotoGallery from './components/PhotoGallery';
import Upload from './components/Upload';

const bucketName = 'mrc-helsinki-photos';

function App() {
  return (
    <div className="App">
      <Router>
        <nav id="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
        </nav>
        <div className="App-Contents">
          <Switch>
            <Route exact path="/">
              <PhotoGallery bucketName={bucketName} />
            </Route>
            <Route path="/upload">
              <Upload></Upload>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
