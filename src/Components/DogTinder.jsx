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
  const [descriptionsVisibilityacept, setDescriptionsVisibilityAcept] = useState({});
  const [descriptionsVisibilityreject, setDescriptionsVisibilityReject] = useState({});

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
      //setShowAcceptedDescription(Array(acceptedDogs.length).fill(false));
      //setShowRejectedDescription(Array(rejectedDogs.length).fill(false));
    }
  };

  const acceptDog = () => {
    const newAcceptedDogs = [...acceptedDogs, { name: dogName, image: dogImage, descrip: dogdescrip }];
    setAcceptedDogs(newAcceptedDogs);

    // Agregar una entrada para el nuevo perro en el estado de visibilidad
    setDescriptionsVisibilityAcept((prevVisibility) => ({
      ...prevVisibility,
      [newAcceptedDogs.length - 1]: false,
    }));

    fetchRandomDog();
  };

  const toggleDescriptionVisibilityAcc = (key) => {
    setDescriptionsVisibilityAcept((prevVisibility) => ({
      ...prevVisibility,
      [key]: !prevVisibility[key],
    }));
  };

  const rejectDog = () => {
    const newRejectedDogs = [...rejectedDogs, { name: dogName, image: dogImage, descrip: dogdescrip}];
    setRejectedDogs(newRejectedDogs);
    // Agregar una entrada para el nuevo perro en el estado de visibilidad
    setDescriptionsVisibilityReject((prevVisibility) => ({
      ...prevVisibility,
      [newRejectedDogs.length - 1]: false,
    }));

    fetchRandomDog();
  };

  const toggleDescriptionVisibilityRej = (key) => {
    setDescriptionsVisibilityReject((prevVisibility) => ({
      ...prevVisibility,
      [key]: !prevVisibility[key],
    }));
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

  const styles = {
    paperContainer: {
        height: 2400,
        backgroundImage: `url(${"../public/wallpaper.png"})`,
    }
};

  return (
    
  <Grid container spacing={3} style={styles.paperContainer}>
    <Grid  item md={4} sm={12}>
    <Grid container direction="column" spacing={2} sx={{ overflowY: 'auto', maxHeight: '100vh', alignItems: 'center' }}>
     
      <Typography variant="h6" style={{ textAlign: 'center',  margin: '20px auto' }}>Perro Candidato</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Card sx={{ maxWidth: 350}} >
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
</Grid>
    
<Grid item md={4} sx={{ overflowY: 'auto' , maxHeight: '100vh' }}>
<Grid container direction="column" spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12}>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Perros Aceptados</Typography>
      </Grid>
      <Grid item xs={12}>
      {acceptedDogs.map((dog, index) => (
        <Card key={index} sx={{ maxWidth: 350 , margin: '20px auto'}}>
          <CardMedia component="img" height="200" image={dog.image} alt="Perro Aceptado" />
          <CardContent>
            <Typography>{dog.name}</Typography>
            {descriptionsVisibilityacept[index] && (
            <Typography>{dog.descrip}</Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => undoAccept(index)} sx={{ backgroundColor: 'red', color: 'white' }}>Arrepentirse</Button>
            <Button
                  onClick={() => toggleDescriptionVisibilityAcc(index)}
                  sx={{ backgroundColor: 'grey', color: 'white' }}
                >
                  {descriptionsVisibilityacept[index] ? 'Ocultar Descripción' : 'Mostrar Descripción'}
                </Button>
          </CardActions>
        </Card>
      ))}
    </Grid>
          </Grid> 
        </Grid>
        <Grid item md={4} sx={{ overflowY: 'auto' , maxHeight: '100vh' }}>
        <Grid container direction="column" spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12}>
      <Typography variant="h6" style={{ textAlign: 'center' }}>Perros Rechazados</Typography>
      {rejectedDogs.map((dog, index) => (
        <Card key={index} sx={{ maxWidth: 350 , margin: '20px auto'}}>
          <CardMedia component="img" height="200" image={dog.image} alt="Perro Rechazado" />
          <CardContent>
            <Typography>{dog.name}</Typography>
            {descriptionsVisibilityreject[index] && (
            <Typography>{dog.descrip}</Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => undoReject(index)} sx={{ backgroundColor: 'red', color: 'white' }}>Arrepentirse</Button>
            <Button
                  onClick={() => toggleDescriptionVisibilityRej(index)}
                  sx={{ backgroundColor: 'grey', color: 'white' }}
                >
                  {descriptionsVisibilityreject[index] ? 'Ocultar Descripción' : 'Mostrar Descripción'}
                </Button>
          </CardActions>
        </Card>
      ))}
     </Grid>
      </Grid> 
      </Grid>
      </Grid>

  );
};
export default DogTinder;