import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, CircularProgress, Typography } from '@mui/material';
import { LoremIpsum } from 'lorem-ipsum';
const getRandomDogImage = async () => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    return response.data.message;
  } catch (error) {
    console.error('Error fetching dog image:', error);
    throw error;
  }
};

const generateRandomName = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomName = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomName += characters[randomIndex];
  }
  return randomName;
};

const DogTinder = () => {
  const [loading, setLoading] = useState(true);
  const [dogImage, setDogImage] = useState('');
  const [dogName, setDogName] = useState(generateRandomName());
  const [dogdescrip, setDogdescrip] = useState();
  const [acceptedDogs, setAcceptedDogs] = useState([]);
  const [rejectedDogs, setRejectedDogs] = useState([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const fetchRandomDog = async () => {
    setLoading(true);
    setButtonsDisabled(true); // Deshabilitar los botones durante la carga de la imagen
    try {
      const imageUrl = await getRandomDogImage();
      const desc = new LoremIpsum().generateSentences(1);
      setDogImage(imageUrl);
      setDogName(generateRandomName());
      setDogdescrip(desc);
    } catch (error) {
      // Manejar el error
    } finally {
      setLoading(false);
      setButtonsDisabled(false); // Habilitar los botones después de cargar la imagen
    }
  };

  const acceptDog = () => {
    const newAcceptedDogs = [...acceptedDogs, { name: dogName, image: dogImage, descrip: dogdescrip}];
    setAcceptedDogs(newAcceptedDogs);
    fetchRandomDog();
  };

  const rejectDog = () => {
    const newRejectedDogs = [...rejectedDogs, { name: dogName, image: dogImage, descrip: dogdescrip}];
    setRejectedDogs(newRejectedDogs);
    fetchRandomDog();
  };

  const undoAccept = (index) => {
    const dogToUndo = acceptedDogs[index];
    const newAcceptedDogs = [...acceptedDogs];
    newAcceptedDogs.splice(index, 1);
    setAcceptedDogs(newAcceptedDogs);
    setRejectedDogs([...rejectedDogs, dogToUndo]);
  };

  const undoReject = (index) => {
    const dogToUndo = rejectedDogs[index];
    const newRejectedDogs = [...rejectedDogs];
    newRejectedDogs.splice(index, 1);
    setRejectedDogs(newRejectedDogs);
    setAcceptedDogs([...acceptedDogs, dogToUndo]);
  };

  useEffect(() => {
    fetchRandomDog();
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={4} sm = {12}>

          
          <Typography variant="h6">Perro Candidato</Typography>
          {loading ? (
            <div>
              <CircularProgress />
            </div>
          ) : (
            <div>
              <img src={dogImage} alt={dogName} />
              <Typography>{dogName}</Typography>
              <Typography>{dogdescrip}</Typography>
              <Button onClick={acceptDog} disabled={buttonsDisabled || loading}>
                Aceptar
              </Button>
              <Button onClick={rejectDog} disabled={buttonsDisabled || loading}>
                Rechazar
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={4}>
          
          <Typography variant="h6">Perros Aceptados</Typography>
          {acceptedDogs.map((dog, index) => (
            <div key={index}>
              <img src={dog.image} alt={dog.name} />
              <Typography>{dog.name}</Typography>
              <Typography>{dog.descrip}</Typography>
              <Button onClick={() => undoAccept(index)}>Arrepentirse</Button>
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
         
          <Typography variant="h6">Perros Rechazados</Typography>
          {rejectedDogs.map((dog, index) => (
            <div key={index}>
              <img src={dog.image} alt={dog.name} />
              <Typography>{dog.name}</Typography>
              <Typography>{dog.descrip}</Typography>
              <Button onClick={() => undoReject(index)}>Arrepentirse</Button>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default DogTinder;