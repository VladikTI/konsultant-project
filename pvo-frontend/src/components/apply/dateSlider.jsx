import { 
    Box, 
    Slider, 
    IconButton,
    Stack
} from "@mui/material";

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { useTheme } from '@mui/material/styles';

const dayjs = require('dayjs')

export default function DateSlider({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();

    var year = new Date().getFullYear() + 1;
    var daysInYear = ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;

    var firstDay = new Date(year, 0, 1);
    const marks = [
        {
          value: dayjs(new Date(year, 0, 15)).diff(dayjs(firstDay), 'day'),
          label: 'Январь',
        },
        {
            value: dayjs(new Date(year, 1, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Февраль',
        },
        {
            value: dayjs(new Date(year, 2, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Март',
        },
        {
            value: dayjs(new Date(year, 3, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Апрель',
        },
        {
            value: dayjs(new Date(year, 4, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Май',
        },
        {
            value: dayjs(new Date(year, 5, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Июнь',
        },
        {
            value: dayjs(new Date(year, 6, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Июль',
        },
        {
            value: dayjs(new Date(year, 7, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Август',
        },
        {
            value: dayjs(new Date(year, 8, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Сентябрь',
        },
        {
            value: dayjs(new Date(year, 9, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Октябрь',
        },
        {
            value: dayjs(new Date(year, 10, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Ноябрь',
        },
        {
            value: dayjs(new Date(year, 11, 15)).diff(dayjs(firstDay), 'day'),
            label: 'Декабрь',
        },
    ];
      
    function valuetext(value) {
        return dayjs(firstDay).dayOfYear(value + 1).format('LL');
    }

    function onLeftClick(){
        var data = JSON.parse(JSON.stringify(applyData));
        data.selectedDay = Math.max(14, data.selectedDay-1);
        setApplyData(data);    
    }

    function onLeftLeftClick(){
        var data = JSON.parse(JSON.stringify(applyData));
        data.selectedDay = Math.max(14, data.selectedDay-7);
        setApplyData(data);    
    }

    function onRightClick(){
        var data = JSON.parse(JSON.stringify(applyData));
        data.selectedDay = Math.min(daysInYear-16, data.selectedDay+1);
        setApplyData(data);    
    }

    function onRightRightClick(){
        var data = JSON.parse(JSON.stringify(applyData));
        data.selectedDay = Math.min(daysInYear-16, data.selectedDay+7);
        setApplyData(data);    
    }

    function onSliderChange(event, value){
        var data = JSON.parse(JSON.stringify(applyData));
        data.selectedDay = value;
        setApplyData(data);  
    }
    
    return (
        <Stack direction="row" alignItems="center" spacing={1} sx={{padding: "20px"}} >
            <IconButton sx={{flex: "0", padding: "0px"}} size="large" onClick = {onLeftLeftClick}>
                <KeyboardDoubleArrowLeftIcon/>
            </IconButton>
            <IconButton sx={{flex: "0", padding: "0px"}} size="large" onClick = {onLeftClick}>
                <KeyboardArrowLeftIcon/>
            </IconButton>
            <Box sx={{ flex: "1"}}>
                <Slider
                    key={`slider-${applyData.selectedDay}`}
                    color = "blue"
                    min={14}
                    max={daysInYear-16}
                    step={1}
                    onChangeCommitted={onSliderChange}
                    defaultValue={applyData.selectedDay}
                    valueLabelFormat={valuetext}
                    valueLabelDisplay="auto"
                    marks={marks}
                    sx = {{
                        marginTop: "20px",
                        '& .MuiSlider-markLabel': {
                            transform: "rotate(45deg)", 
                            paddingLeft: "20px"
                        },
                        '& .MuiSlider-mark': {
                            backgroundColor: '#bfbfbf',
                            height: "8px",
                            width: "1px",
                            '&.MuiSlider-markActive': {
                                height: "8px",
                                width: "1px",
                                opacity: 1,
                                backgroundColor: 'currentColor',
                            },
                        },
                    }}
                />
            </Box>
            <IconButton sx={{flex: "0", padding: "0px"}} size="large" onClick = {onRightClick}>
                <KeyboardArrowRightIcon/>
            </IconButton>
            <IconButton sx={{flex: "0", padding: "0px"}} size="large" onClick = {onRightRightClick}>
                <KeyboardDoubleArrowRightIcon/>
            </IconButton>
        </Stack> 
    );
}