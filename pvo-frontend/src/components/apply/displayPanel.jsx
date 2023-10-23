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

import HorizontalDivider from "../../components/horizontalDivider";
import VerticalDivider from "../../components/verticalDivider";

export default function DisplayPanel({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();

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
                                {(props) => renderRow({...props, remoteData})}
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
    const { index, style, remoteData } = props;

    var application = remoteData.myApplications[index];
    //    {"Начало: " + application.start_date + " длительность: " + application.amount_days + " статус: " + application.status} />
    
    var dateBegin = new Date(Date.parse(application.start_date));
    var dateEnd = new Date(dateBegin);
    dateEnd.setDate(dateEnd.getDate() + application.amount_days - 1);

    if (application.amount_days % 10 == 1) var ending = " день";
    else if (application.amount_days % 10 == 2) var ending = " дня";
    else if (application.amount_days % 10 == 3) var ending = " дня";
    else if (application.amount_days % 10 == 4) var ending = " дня";
    else var ending = " дней";
     
    if (application.status == -1) var strStatus = "отказано";
    else if (application.status == 0) var strStatus = "на рассмотрении";
    else var strStatus = "одобрено";

    return (
        <ListItem style={{...style, padding: "10px", paddingBottom: "5px"}} key={index} component="div">
            <Card variant="outlined" sx={{width:"100%", height:"100%", display: "flex", flexDirection: "column"}}>
                <CardContent sx={{margin: "5px", padding: "5px", paddingLeft: "10px"}}>
                    <Typography variant="body1" sx={{fontWeight:"400"}} gutterBottom>
                        {dateBegin.toLocaleDateString('ru-RU')} - {dateEnd.toLocaleDateString('ru-RU')} 
                    </Typography>
                    <Typography variant="h5" sx={{fontWeight:"400"}} gutterBottom>
                        {application.amount_days + ending} 
                    </Typography>
                    <Typography variant="h6" sx={{fontWeight:"400"}}>
                        {"Статус: " + strStatus} 
                    </Typography>
                </CardContent>
                <CardActions sx={{marginTop: "auto", padding: "0px", paddingLeft: "10px", paddingBottom: "5px"}}>
                    <Button size="medium" color="red" sx={{padding:"5px"}}>Убрать заявку</Button>
                </CardActions>
            </Card>
        </ListItem>
    );
}