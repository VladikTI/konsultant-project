import { 
    Box, 
    Typography,
    CircularProgress
} from "@mui/material";

import { useTheme } from '@mui/material/styles';
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HorizontalDivider from "../components/horizontalDivider";
import VerticalDivider from "../components/verticalDivider";
import DisplayPanel from "../components/apply/displayPanel";
import Timeline from "../components/apply/timeline";
import ApplyingPanel from "../components/apply/applyingPanel";


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
    ``
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
    const [remoteData,  setRemoteData]  = useState({daysLeft: 28, myApplications: [
        {employee_id: 0, start_date: "2024-10-20", amount_days: 15, status: 1},
        {employee_id: 0, start_date: "2024-01-20", amount_days: 14, status: 1},
        {employee_id: 0, start_date: "2024-05-20", amount_days: 20, status: -1},
        {employee_id: 0, start_date: "2024-01-25", amount_days: 10, status: 0},
        {employee_id: 0, start_date: "2024-02-25", amount_days: 10, status: 0}
    ], applications: [
        {employee_id: 5, start_date: '2024-01-01', amount_days: 22, status: 1},
        {employee_id: 5, start_date: '2024-02-03', amount_days: 11, status: 1},
        {employee_id: 5, start_date: '2024-02-23', amount_days: 26, status: 1},
        {employee_id: 5, start_date: '2024-04-01', amount_days: 22, status: 1},
        {employee_id: 5, start_date: '2024-05-02', amount_days: 25, status: 1},
        {employee_id: 5, start_date: '2024-06-06', amount_days: 28, status: 1},
        {employee_id: 5, start_date: '2024-07-12', amount_days: 26, status: 1},
        {employee_id: 5, start_date: '2024-08-14', amount_days: 19, status: 1},
        {employee_id: 5, start_date: '2024-09-09', amount_days: 13, status: 1},
        {employee_id: 5, start_date: '2024-10-06', amount_days: 18, status: 1},
        {employee_id: 5, start_date: '2024-11-06', amount_days: 14, status: 1},
        {employee_id: 12, start_date: '2024-01-01', amount_days: 13, status: 1},
        {employee_id: 12, start_date: '2024-01-20', amount_days: 20, status: 1},
        {employee_id: 12, start_date: '2024-02-21', amount_days: 27, status: 1},
        {employee_id: 12, start_date: '2024-03-25', amount_days: 21, status: 1},
        {employee_id: 12, start_date: '2024-04-26', amount_days: 20, status: 1},
        {employee_id: 12, start_date: '2024-05-30', amount_days: 16, status: 1},
        {employee_id: 12, start_date: '2024-06-28', amount_days: 25, status: 1},
        {employee_id: 12, start_date: '2024-08-04', amount_days: 26, status: 1},
        {employee_id: 12, start_date: '2024-09-08', amount_days: 11, status: 1},
        {employee_id: 12, start_date: '2024-10-02', amount_days: 10, status: 1},
        {employee_id: 12, start_date: '2024-10-18', amount_days: 22, status: 1},
        {employee_id: 12, start_date: '2024-11-24', amount_days: 10, status: 1},
        {employee_id: 123, start_date: '2024-01-01', amount_days: 25, status: 1},
        {employee_id: 123, start_date: '2024-02-05', amount_days: 17, status: 1},
        {employee_id: 123, start_date: '2024-03-03', amount_days: 12, status: 1},
        {employee_id: 123, start_date: '2024-03-23', amount_days: 28, status: 1},
        {employee_id: 123, start_date: '2024-04-28', amount_days: 17, status: 1},
        {employee_id: 123, start_date: '2024-05-22', amount_days: 27, status: 1},
        {employee_id: 123, start_date: '2024-06-30', amount_days: 12, status: 1},
        {employee_id: 123, start_date: '2024-07-18', amount_days: 20, status: 1},
        {employee_id: 123, start_date: '2024-08-20', amount_days: 25, status: 1},
        {employee_id: 123, start_date: '2024-09-20', amount_days: 19, status: 1},
        {employee_id: 123, start_date: '2024-10-22', amount_days: 19, status: 1},
        {employee_id: 123, start_date: '2024-11-16', amount_days: 27, status: 1},
        {employee_id: 525, start_date: '2024-01-01', amount_days: 27, status: 1},
        {employee_id: 525, start_date: '2024-02-05', amount_days: 27, status: 1},
        {employee_id: 525, start_date: '2024-03-17', amount_days: 19, status: 1},
        {employee_id: 525, start_date: '2024-04-17', amount_days: 12, status: 1},
        {employee_id: 525, start_date: '2024-05-13', amount_days: 22, status: 1},
        {employee_id: 525, start_date: '2024-06-14', amount_days: 28, status: 1},
        {employee_id: 525, start_date: '2024-07-20', amount_days: 19, status: 1},
        {employee_id: 525, start_date: '2024-08-15', amount_days: 16, status: 1},
        {employee_id: 525, start_date: '2024-09-07', amount_days: 11, status: 1},
        {employee_id: 525, start_date: '2024-10-02', amount_days: 18, status: 1},
        {employee_id: 525, start_date: '2024-11-01', amount_days: 12, status: 1},
        {employee_id: 525, start_date: '2024-11-19', amount_days: 14, status: 1},
        {employee_id: 52, start_date: '2024-01-01', amount_days: 11, status: 1},
        {employee_id: 52, start_date: '2024-01-18', amount_days: 27, status: 1},
        {employee_id: 52, start_date: '2024-02-29', amount_days: 22, status: 1},
        {employee_id: 52, start_date: '2024-04-04', amount_days: 18, status: 1},
        {employee_id: 52, start_date: '2024-05-05', amount_days: 17, status: 1},
        {employee_id: 52, start_date: '2024-05-30', amount_days: 28, status: 1},
        {employee_id: 52, start_date: '2024-07-08', amount_days: 28, status: 1},
        {employee_id: 52, start_date: '2024-08-14', amount_days: 24, status: 1},
        {employee_id: 52, start_date: '2024-09-19', amount_days: 21, status: 1},
        {employee_id: 52, start_date: '2024-10-16', amount_days: 20, status: 1},
        {employee_id: 52, start_date: '2024-11-19', amount_days: 13, status: 1},
        {employee_id: 1234, start_date: '2024-01-01', amount_days: 28, status: 1},
        {employee_id: 1234, start_date: '2024-02-13', amount_days: 20, status: 1},
        {employee_id: 1234, start_date: '2024-03-12', amount_days: 17, status: 1},
        {employee_id: 1234, start_date: '2024-04-03', amount_days: 18, status: 1},
        {employee_id: 1234, start_date: '2024-04-27', amount_days: 17, status: 1},
        {employee_id: 1234, start_date: '2024-05-24', amount_days: 15, status: 1},
        {employee_id: 1234, start_date: '2024-06-18', amount_days: 23, status: 1},
        {employee_id: 1234, start_date: '2024-07-16', amount_days: 13, status: 1},
        {employee_id: 1234, start_date: '2024-08-05', amount_days: 17, status: 1},
        {employee_id: 1234, start_date: '2024-08-27', amount_days: 28, status: 1},
        {employee_id: 1234, start_date: '2024-10-09', amount_days: 27, status: 1},
        {employee_id: 1234, start_date: '2024-11-19', amount_days: 12, status: 1},
    ]});
    const [applyData,   setApplyData]   = useState({isApplying: false, selectedDay: 14, firstSelector: null, secondSelector: null});

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
            <Timeline remoteData={remoteData} applyData={applyData} setApplyData={setApplyData} setRemoteData={setRemoteData}/>
            <VerticalDivider/>
            <div id="navbar"    style={{height: "100%", width: "100px", flex:"none"}}>
            </div>
        </Box>
    );
}



function Panel({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();
    
    return (
        <Box sx={{height: "100%", width: "380px", display: "flex", flexDirection: "column", flex: "none"}}>
            <Box sx={{height: "59px", display: "flex", alignItems: "center"}}>
                { 
                    !applyData.isApplying &&
                    <Typography variant="h5" fontWeight="600" gutterBottom color={theme.palette.blue.dark} sx={{paddingLeft: "10px", margin: "10px"}}>
                        Мои заявки
                    </Typography> 
                }
                {
                    applyData.isApplying &&
                    <Typography variant="h5" fontWeight="600" gutterBottom color={theme.palette.blue.dark} sx={{paddingLeft: "10px", margin: "10px"}}>
                    Подача заявки
                    </Typography>
                }
            </Box>
            <HorizontalDivider/>
            <Box sx={{height: "40px", display: "flex", alignItems: "center"}}>
                <Typography variant="body1" fontWeight="600" gutterBottom sx={{paddingLeft: "10px", margin: "10px"}}>
                    Малявко Ян Александрович
                </Typography>
            </Box>
            <HorizontalDivider/>
            <Box sx={{height: "40px", display: "flex", alignItems: "center"}}>
                <Typography variant="body1" fontWeight="600" gutterBottom sx={{paddingLeft: "10px", margin: "10px"}}>
                    Доступные дни для отпуска: {remoteData.daysLeft}
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


