import React from 'react';
import DogTinder from './Components/DogTinder';
import Titulos from './Components/titulos';

function App() {
  return (
    <div className="App">
      <div className='titulos'>
        <Titulos/>
      </div>
      <div className="perros">
        <DogTinder />
      </div>
    </div>
  );
}

export default App;