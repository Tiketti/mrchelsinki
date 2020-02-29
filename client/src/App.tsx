import React from 'react';
import './App.scss';
import PhotoGallery from './components/PhotoGallery';

function App() {
  return (
    <div className="App">
      <nav id="navigation">
        <ul>
          <li>Home</li>
          <li>Upload</li>
        </ul>
      </nav>
      <div className="App-Contents">
        <PhotoGallery bucketName="mrc-helsinki-photos" />
      </div>
    </div>
  );
}

export default App;
