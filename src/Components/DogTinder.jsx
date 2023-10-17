import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, CircularProgress, Typography, Card, CardActions, CardContent, CardMedia} from '@mui/material';
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
  const [showAcceptedDescription, setShowAcceptedDescription] = useState(false);
  const [showRejectedDescription, setShowRejectedDescription] = useState(false);

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
      setShowAcceptedDescription(Array(acceptedDogs.length).fill(false));
      setShowRejectedDescription(Array(rejectedDogs.length).fill(false));
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

  const toggleAcceptedDescription = (index) => {
    const updatedShowAcceptedDescription = [...showAcceptedDescription];
    updatedShowAcceptedDescription[index] = !updatedShowAcceptedDescription[index];
    setShowAcceptedDescription(updatedShowAcceptedDescription);
  };

  const toggleRejectedDescription = (index) => {
    const updatedShowRejectedDescription = [...showRejectedDescription];
    updatedShowRejectedDescription[index] = !updatedShowRejectedDescription[index];
    setShowRejectedDescription(updatedShowRejectedDescription);
  };

  const styles = {
    paperContainer: {
        height: 1356,
    }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
  <Grid container spacing={10} style={styles.paperContainer}>
    <Grid  item md={4} sm={12}>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Perro Candidato</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Card sx={{ maxWidth: 350 }}>
          <CardMedia component="img" height="350" image={dogImage} alt="Perro Candidato" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {dogName}
            </Typography>
            <Typography variant="body1">
              {dogdescrip}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button onClick={acceptDog} disabled={buttonsDisabled} sx={{ backgroundColor: 'green', color: 'white' }}>
              Aceptar
            </Button>
            <Button onClick={rejectDog} disabled={buttonsDisabled} sx={{ backgroundColor: 'red', color: 'white' }}>
              Rechazar
            </Button>
          </CardActions>
        </Card>
      )}
    </Grid>
    <Grid item md={4} sm={6}>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Perros Aceptados</Typography>
      {acceptedDogs.map((dog, index) => (
        <Card key={index} sx={{ maxWidth: 350 }}>
          <CardMedia component="img" height="200" image={dog.image} alt="Perro Aceptado" />
          <CardContent>
            <Typography>{dog.name}</Typography>
            {showAcceptedDescription[index] && (
            <Typography>{dog.descrip}</Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => undoAccept(index)} sx={{ backgroundColor: 'red', color: 'white' }}>Arrepentirse</Button>
            <Button
                  onClick={() => toggleAcceptedDescription(index)}
                  sx={{ backgroundColor: 'grey', color: 'white' }}
                >
                  {showAcceptedDescription[index] ? 'Ocultar Descripción' : 'Mostrar Descripción'}
                </Button>
          </CardActions>
        </Card>
      ))}
    </Grid>
    <Grid item md={4} sm={6}>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Perros Rechazados</Typography>
      {rejectedDogs.map((dog, index) => (
        <Card key={index}>
          <CardMedia component="img" height="200" image={dog.image} alt="Perro Rechazado" />
          <CardContent>
            <Typography>{dog.name}</Typography>
            {showRejectedDescription[index] && (
            <Typography>{dog.descrip}</Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => undoReject(index)} sx={{ backgroundColor: 'red', color: 'white' }}>Arrepentirse</Button>
            <Button
                  onClick={() => toggleRejectedDescription(index)}
                  sx={{ backgroundColor: 'grey', color: 'white' }}
                >
                  {showRejectedDescription[index] ? 'Ocultar Descripción' : 'Mostrar Descripción'}
                </Button>
          </CardActions>
        </Card>
      ))}
    </Grid>
  </Grid>
</div>

  );
};
export default DogTinder;