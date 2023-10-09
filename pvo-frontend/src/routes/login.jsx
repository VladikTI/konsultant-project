import {Alert, Box, Button, Container, TextField, ThemeProvider, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { createTheme } from '@mui/material/styles';

export default function Login() {
    useNavigate();
    const [error, setError] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();

        // validate the inputs
        if (!login || !password) {
            setError("Пожалуйста, введите свой логин и пароль");
            return;
        }

        // clear the errors
        setError("");

        // TODO: send the login request
        console.log("Logging in...");
    }

    const theme = createTheme({
        palette: {
            blue: {
                main: '#00A3FF',
                light: '#00A3FF',
                dark: '#0077FF',
                contrastText: '#000000',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
        <Container maxWidth="xs" sx={{mt: 30}}>
            <Typography variant="h5" component="h1" gutterBottom textAlign="center">
                Вход в аккаунт
            </Typography>
            {error && <Alert severity="error" sx={{my: 2}}>{error}</Alert>}
            <Box component="form" onSubmit={onSubmit}>
                <TextField
                    label="Логин"
                    variant="outlined"
                    autoComplete="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    sx={{mt: 1}}
                    fullWidth
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{mt: 3}}
                    fullWidth
                />
                <Button variant="contained" color="blue" type="submit" sx={{mt: 3}} fullWidth>Войти</Button>
            </Box>
        </Container>
        </ThemeProvider>
    )
}