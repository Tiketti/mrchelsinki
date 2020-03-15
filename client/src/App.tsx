import React from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.scss';
import Photo from './components/Photo';
import PhotoGallery from './components/PhotoGallery';
import Upload from './components/Upload';

const thumbnailBucketname =
  process.env.THUMBNAIL_BUCKET_NAME || 'mrc-helsinki-photos-thumb';
const fullSizeBucketname =
  process.env.OUTPUT_BUCKET_NAME || 'mrc-helsinki-photos-output';
const thumbnailFilePrefix = 'thumb_';

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
              <PhotoGallery
                thumbnailBucketname={thumbnailBucketname}
                fullSizeBucketname={fullSizeBucketname}
                thumbnailFilePrefix={thumbnailFilePrefix}
              />
            </Route>
            <Route path="/photo/:url">
              <Photo />
            </Route>
            <Route path="/upload">
              <Upload />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
