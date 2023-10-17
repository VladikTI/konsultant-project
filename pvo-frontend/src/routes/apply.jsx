import { 
    Button, 
    Box, 
    Typography, 
    Container, 
    CircularProgress,
    ListItem, 
    ListItemButton, 
    ListItemText,
    Card,
    CardContent,
    CardActions,
    IconButton,
    CloseButton
} from "@mui/material";

import { useTheme } from '@mui/material/styles';

import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from 'react-window';

import HorizontalDivider from "../components/horizontalDivider";
import VerticalDivider from "../components/verticalDivider";


    /*

    {
    "data":[
        {
            "employee_id": EMPLOYEE_ID,
            "applications": [{ 
                    "employee_id": EMPLOYEE_ID,
                    "start_date": START_DATE,
                    "amount_days": AMOUNT_DAYS,
                    "status": STATUS
                }]
            }
        ]
    }
    ```
    | Поле | Описание | Тип данных | Примечания |
    |------|----------|------------|------------|
    | _employee_id_ | ID сотрудника | **int** ||
    | _start_date_ | Дата начала отпуска | **string** | Дата в формате YYYY-MM-DD |
    | _amount_days_ | Количество дней отпуска | **int** ||
    | _status_ | Статус заявления | **int** | -1: Отказано; 0: На рассмотрении; 1: Одобрена |

    */

    /*

    remoteData{
        daysLeft: int,
        myApplications: [{}],
        applications: [{}]
    }

    */

async function loadData(setLoaded, setApplyData)
{
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("готово!"), 500)
    });

    let result = await promise; // будет ждать, пока промис не выполнится (*)
    setLoaded(true);
}

function isAuth(){return true;}

export default function Apply() {
    
    useNavigate();
    const [loaded,      setLoaded]      = useState(false);
    const [remoteData,  setRemoteData]  = useState({daysLeft: 300, myApplications: [
        {employee_id: 0, start_date: "2024-10-20", amount_days: 1, status: 1},
        {employee_id: 0, start_date: "2024-01-20", amount_days: 1, status: 1},
        {employee_id: 0, start_date: "2024-05-20", amount_days: 2, status: -1},
        {employee_id: 0, start_date: "2024-01-25", amount_days: 3, status: 0},
    ], applications: []});
    const [applyData,   setApplyData]   = useState({isApplying: false, selectedDay: 0, firstSelector: null, secondSelector: null});

    useEffect(() => {loadData(setLoaded, setRemoteData)});

    if(!isAuth())
    return (<Navigate to="/login" replace={true} />);

    if (!loaded){
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <CircularProgress size="100px"/>
            </Box>
        );
    }

    return (
        <Box id="app" sx={{height: "100%", width: "100%", display: "flex"}}>
            <Panel remoteData={remoteData} applyData={applyData} setApplyData={setApplyData} setRemoteData={setRemoteData}/>
            <VerticalDivider/>
            <div id="timeline"  style={{flex: "auto"}}>
            </div>
            <VerticalDivider/>
            <div id="navbar"    style={{height: "100%", width: "100px"}}>
            </div>
        </Box>
    );
}

function Panel({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();
    
    return (
        <Box sx={{height: "100%", width: "380px", display: "flex", flexDirection: "column"}}>
            <Box>
                <Typography variant="h5" fontWeight="600" gutterBottom color={theme.palette.blue.dark} sx={{paddingLeft: "10px", margin: "10px"}}>
                    Мои заявки
                </Typography>
            </Box>
            <HorizontalDivider/>
            <Box>
                <Typography variant="body1" fontWeight="600" gutterBottom color={theme.palette.blue.contrastText} sx={{paddingLeft: "10px", margin: "10px"}}>
                    Доступные отпускные: {remoteData.daysLeft}
                </Typography>
            </Box>
            <HorizontalDivider/>
            <Box sx={{flex:"1"}}>
                {
                    applyData.isApplying &&
                    <ApplyingPanel remoteData={remoteData} applyData={applyData} setApplyData={setApplyData} setRemoteData={setRemoteData} />
                }
                {
                    (!applyData.isApplying) &&
                    <DisplayPanel remoteData={remoteData} applyData={applyData} setApplyData={setApplyData} setRemoteData={setRemoteData} />
                }
            </Box>
        </Box>            
    );
}

function DisplayPanel({remoteData, applyData, setRemoteData, setApplyData}){
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
                    <Button variant="contained" size="large" onClick={onApplyButtonClick}>Подать новую заявку</Button>
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
                                itemSize={200}
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
                    <Button variant="contained" size="large" onClick={onApplyButtonClick}>Подать новую заявку</Button>
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
    else var ending = " дня";
     
    if (application.status == -1) var strStatus = "отказано";
    else if (application.status == 0) var strStatus = "на рассмотрении";
    else var strStatus = "одобрено";

    return (
        <ListItem style={{...style, padding: "10px", paddingBottom: "5px"}} key={index} component="div">
            <Card variant="outlined" sx={{width:"100%", height:"100%", display: "flex", flexDirection: "column"}}>
                <CardContent>
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
                <CardActions sx={{marginTop: "auto"}}>
                    <Button size="medium">Убрать заявку</Button>
                </CardActions>
            </Card>
        </ListItem>
    );
}

function ApplyingPanel({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();

    function onCancelApplyButtonClick()
    {
        var data = JSON.parse(JSON.stringify(applyData));
        data.isApplying = false;
        data.firstSelector = null;
        data.secondSelector = null;
        setApplyData(data);    
    }
    
    return (
        <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            
            <Box sx={{flex: "1", textAlign: "center"}}>
                <Typography variant="h6" fontWeight="500" gutterBottom color={theme.palette.blue.dark}>
                    ПОДАЁМ НОВУЮ ЗАЯВКУ
                </Typography>
            </Box>

            <HorizontalDivider/>
            
            <Container sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "300px", height:"80px"}}>
                <Button variant="contained" size="large" onClick={onCancelApplyButtonClick}>Назад</Button>
            </Container>

        </Box>
    );
}