import { 
    Button, 
    Box, 
    Typography, 
    Container, 
    TextField
} from "@mui/material";

import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers';
import { useContext, useState } from "react";

import HorizontalDivider from "../../components/horizontalDivider";

import { AuthStatus, authContext } from "../../contexts/authContext";

const dayjs = require('dayjs')


export default function ApplyingPanel({remoteData, applyData, setRemoteData, setApplyData, setLoaded}){
    const theme = useTheme();
    const authData = useContext(authContext);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [comment, setComment] = useState(null);

    function onCancelButtonClick()
    {
        var data = JSON.parse(JSON.stringify(applyData));
        data.isApplying = false;
        data.firstSelector = null;
        data.secondSelector = null;
        setApplyData(data);    
    }

    function onApplyButtonClick()
    {
        setLoaded(false);
        async function foo() {
            let response = await authData.postWithAuth("/api/create_application", { start_date:     startDate.format('YYYY-MM-DDTHH:mm:ss'), 
                                                                                    end_date:       endDate.format('YYYY-MM-DDTHH:mm:ss'),
                                                                                    comment:        comment,
                                                                                    days:           endDate.diff(startDate, "days") + 1,
                                                                                    employee_id:    authData.userData.id } );
        };
        
        foo().then(()=>{window.location.reload(false);});
    }
    
    return (
        <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            
            <Box sx={{flex: "1", textAlign: "left"}}>
                <Typography variant="h6" fontWeight="500" color={theme.palette.blue.dark} sx={{margin: "5px", marginLeft: "10px", marginTop: "5px", paddingLeft: "10px"}}>
                    Даты:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField  
                        sx = {{width: "340px", margin: "10px", marginLeft: "20px"}} 
                        slotProps={{ textField: { size: 'medium' } }} 
                        label = "Начало отпуска"
                        focused = "true"
                        format = "DD.MM.YYYY" 
                        color = "blue"
                        onChange = {(value) => setStartDate(dayjs(value))} />
                    <DateField  
                        sx = {{width: "340px", margin: "10px", marginLeft: "20px", marginBottom: "20px"}} 
                        slotProps={{ textField: { size: 'medium' } }} 
                        label = "Конец отпуска"
                        focused = "true"
                        format = "DD.MM.YYYY" 
                        color = "blue"
                        onChange = {(value) => setEndDate(dayjs(value))} />
                </LocalizationProvider>
                <HorizontalDivider/>
                <Typography variant="h6" fontWeight="500" color={theme.palette.blue.dark} sx={{margin: "5px", marginLeft: "10px", paddingLeft: "10px"}}>
                    Комментарий к заявке:
                </Typography>
                <Container disableGutters sx={{padding: "10px", paddingLeft: "20px", paddingRight: "20px"}}>
                    <TextField
                        id="outlined-multiline-static"
                        color="blue"
                        placeholder="Введите комментарий"
                        focused
                        multiline
                        fullWidth
                        minRows={8}
                        maxRows={16}
                        onChange = {(event) => setComment(event.target.value)}
                        InputProps={{style: {fontSize: 14, padding: "8px"}}}
                    />
                </Container>
            </Box>

            <HorizontalDivider/>
            
            <Container sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "380px", height:"80px"}}>
                <Button variant="contained" size="large" onClick={onCancelButtonClick} color={"red"} sx = {{width: "154px"}}>Назад</Button>
                <Box sx = {{width: "24px"}}></Box>
                <Button variant="contained" size="large" onClick={onApplyButtonClick} color={"green"} sx = {{width: "154px"}}>Отправить</Button>
            </Container>

        </Box>
    );
}