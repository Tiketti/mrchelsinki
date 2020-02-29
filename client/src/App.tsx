import React from 'react';
import './App.css';
import PhotoGallery from './components/PhotoGallery';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PhotoGallery bucketName="mrc-helsinki-photos" />
      </header>
    </div>
  );
}

export default App;
