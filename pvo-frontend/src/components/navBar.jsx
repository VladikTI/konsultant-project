import { 
    Stack,
    Box,
    IconButton
} from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventIcon from '@mui/icons-material/Event';

import { useTheme } from '@mui/material/styles';
import { useEffect, useState, useContext} from "react";
import { useNavigate } from "react-router-dom";

import { AuthStatus, authContext } from "../contexts/authContext";

export default function NavBar(){
    const authData = useContext(authContext);
    const [role, setRole] = useState(0);

    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (authData.userData !== null) setRole(authData.userData.roleId)
    }, [authData]);

    function onEventClick(){
        navigate("/apply");
    };

    function onEditClick(){
        //navigate("apply");
    };

    function onApartmentClick(){
        navigate("/admin");
    };

    function onLogoutClick(){
        authData.logout();
    };

    return (
        <Box sx={{height: "100%", width: "100px", display: "flex", flexDirection: "column", flex: "none"}}>
            <Stack direction = "column" spacing = {4} sx = {{margin: "auto"}}>
                <IconButton sx={{height: "60px", width: "60px"}} onClick = {onEventClick}>
                    <EventIcon sx={{transform: "scale(2.0)"}}/>
                </IconButton>
                {
                    role === 1 && 
                    <IconButton sx={{height: "60px", width: "60px"}} onClick = {onEditClick}>
                        <EditIcon sx={{transform: "scale(2.0)"}}/>
                    </IconButton>
                }
                {
                    role === 1 &&
                    <IconButton sx={{height: "60px", width: "60px"}} onClick = {onApartmentClick}>
                        <ApartmentIcon sx={{transform: "scale(2.0)"}}/>
                    </IconButton>
                }
                <IconButton sx={{height: "60px", width: "60px"}} onClick = {onLogoutClick} >
                    <LogoutIcon sx={{transform: "scale(2.0)"}}/>
                </IconButton>
            </Stack>
        </Box>            
    );
}