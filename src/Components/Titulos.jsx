import {Grid, Typography, Box} from '@mui/material';

export const Titulos = () => {
    return (
        
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={6} md={4}>
                    <Typography variant="h3" style={{ textAlign: 'center',  margin: '20px auto' }}>Perros Candidatos</Typography>
                </Grid> 

                <Grid item xs={6} md={4}>
                    <Typography variant="h4" style={{ textAlign: 'center',  margin: '20px auto' }}>Perros Aceptados</Typography>
                </Grid> 

                <Grid item xs={6} md={4}>
                    <Typography variant="h4" style={{ textAlign: 'center',  margin: '20px auto' }}>Perros Rechazados</Typography>
                </Grid> 
            </Grid>
        </Box>
    )   
}
export default Titulos;