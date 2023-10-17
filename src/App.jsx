import React from 'react';
import DogTinder from './Components/DogTinder';

function App() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <div className="App" style={containerStyle} >
      <DogTinder />
    </div>
  );
}

export default App;