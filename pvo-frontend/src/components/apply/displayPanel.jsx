import { 
    Button, 
    Box, 
    Typography, 
    Container, 
    ListItem, 
    Card,
    CardContent,
    CardActions
} from "@mui/material";

import { useTheme } from '@mui/material/styles';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from 'react-window';
import { useContext, useState } from "react";

import HorizontalDivider from "../../components/horizontalDivider";
import VerticalDivider from "../../components/verticalDivider";

import { AuthStatus, authContext } from "../../contexts/authContext";

export default function DisplayPanel({remoteData, applyData, setRemoteData, setApplyData, setLoaded}){
    const theme = useTheme();
    const authData = useContext(authContext);

    function onApplyButtonClick()
    {
        var data = JSON.parse(JSON.stringify(applyData));
        data.isApplying = true;
        setApplyData(data);    
    }

    if(remoteData.myApplications.length === 0){
        return (
            <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
                <Box sx={{flex: "2"}}/>
                <Box sx={{textAlign: "center"}}>
                    <Typography variant="h6" fontWeight="500" gutterBottom color={theme.palette.blue.dark}>
                        У ВАС ПОКА НЕТ ЗАЯВОК
                    </Typography>
                </Box>
                <Container sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "300px", height:"80px"}}>
                    <Button variant="contained" size="large" onClick={onApplyButtonClick} color="blue">Подать новую заявку</Button>
                </Container>
                <Box sx={{flex: "2"}}/>
            </Box>
        );
    }
    else {
        return (
            <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
                
                <Box sx={{flex: "1", textAlign: "center"}}>
                    <AutoSizer>
                        {({height, width}) => (
                            <FixedSizeList
                                height={height}
                                width={width}
                                itemSize={180}
                                itemCount={remoteData.myApplications.length}
                                overscanCount={5}
                            >
                                {(props) => renderRow({...props, remoteData, setLoaded, authData, theme})}
                            </FixedSizeList>
                        )}

                    </AutoSizer>
                </Box>

                <HorizontalDivider/>
                
                <Container sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "300px", height:"80px"}}>
                    <Button variant="contained" size="large" onClick={onApplyButtonClick} color='blue'>Подать новую заявку</Button>
                </Container>

            </Box>
        );
    }
}

var renderRow = props => {

    const { index, style, remoteData, setLoaded, authData, theme} = props;

    var application = remoteData.myApplications[index];

    //console.log(JSON.stringify(application))
    //    {"Начало: " + application.start_date + " длительность: " + application.days + " статус: " + application.status} />
    
    var dateBegin = new Date(Date.parse(application.start_date));
    var dateEnd = new Date(dateBegin);
    dateEnd.setDate(dateEnd.getDate() + application.days - 1);

    if (application.days % 10 == 1) var ending = " день";
    else if (application.days % 10 == 2) var ending = " дня";
    else if (application.days % 10 == 3) var ending = " дня";
    else if (application.days % 10 == 4) var ending = " дня";
    else var ending = " дней";
     
    if (application.status == "rejected") {
        var strStatus = "отказано";
        var color = theme.palette.red.light + '12';
    } 
    else if (application.status == "awaiting") {
        var strStatus = "на рассмотрении";
        var color = theme.palette.blue.light + '12';
    }
    else {
        var strStatus = "одобрено";
        var color = theme.palette.green.light + '12';
    }

    function onDeleteButtonClick()
    {
        setLoaded(false);
        async function foo() {
            let response = await authData.postWithAuth("/api/delete_application", { request_id: application.request_id } );
        };
        
        foo().then(()=>{window.location.reload(false);});
    }

    return (
        <ListItem style={{...style, padding: "10px", paddingBottom: "5px"}} key={index} component="div">
            <Card variant="outlined" sx={{width:"100%", height:"100%", display: "flex", flexDirection: "column", bgcolor: color}}>
                <CardContent sx={{margin: "5px", padding: "5px", paddingLeft: "10px"}}>
                    <Typography variant="body1" sx={{fontWeight:"400"}} gutterBottom>
                        {dateBegin.toLocaleDateString('ru-RU')} - {dateEnd.toLocaleDateString('ru-RU')} 
                    </Typography>
                    <Typography variant="h5" sx={{fontWeight:"400"}} gutterBottom>
                        {application.days + ending} 
                    </Typography>
                    <Typography variant="h6" sx={{fontWeight:"400"}}>
                        {"Статус: " + strStatus} 
                    </Typography>
                </CardContent>
                <CardActions sx={{marginTop: "auto", padding: "0px", paddingLeft: "10px", paddingBottom: "5px"}}>
                    <Button size="medium" color="red" onClick={onDeleteButtonClick} sx={{padding:"5px"}}>Убрать заявку</Button>
                </CardActions>
            </Card>
        </ListItem>
    );
}