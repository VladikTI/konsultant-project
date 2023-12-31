import { 
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Typography
} from "@mui/material";

import { useTheme } from '@mui/material/styles';
import AutoSizer from "react-virtualized-auto-sizer";

const dayjs = require('dayjs')

const ROWS = 10;
const COLUMNS = 30;

export default function DateTable({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();

    var year = new Date().getFullYear() + 1;
    var daysInYear = ((year % 4 === 0 && year % 100 > 0) || year %400 === 0) ? 366 : 365;
    var firstDay = new Date(year, 0, 1);

    function getDate(i)
    {
        var str = dayjs(firstDay).dayOfYear(applyData.selectedDay + i - 13).format('LL');
        return str.substring(0, str.length-7);
    }

    const tableIds = new Array(ROWS).fill(-1).map(() => new Array(daysInYear).fill(-1));

    var busyDays = new Array(ROWS).fill(new Set());

    const namesById = new Map(
        remoteData.applications.map(obj => {
          return [obj.employee_id, {name: obj.name, surname: obj.surname, patronym: obj.patronym}];
        })
    );
    namesById.set(-1, {name: '', surname: 'pupu', patronym: ''})

    function setDays(i_begin){
        return new Set(Array.from({length: amount_days}, (x, j) => j + i_begin));
    }

    function intersectSets(setA, setB)
    {
        return new Set([...setA].filter(i => setB.has(i)));;
    }

    for (let i = 0; i < remoteData.applications.length; i++) {
        var i_begin = dayjs(new Date(Date.parse(remoteData.applications[i]["start_date"]))).diff(dayjs(firstDay), 'day');
        var amount_days = remoteData.applications[i]["days"];
        var daysSet = setDays(i_begin);

        for (let k = 0; k < busyDays.length; k++) {
            let intersect = intersectSets(busyDays[k], daysSet);
            if (intersect.size === 0) {
                busyDays[k] = new Set([...busyDays[k], ...daysSet]);
                for (let m = 0; m < daysSet.size; m++){
                    tableIds[k][m + i_begin] = remoteData.applications[i]["employee_id"];;
                }
                break;
            }
        }
    }

    
    function fillRow(row)
    {
        var result = []
        var i0 = applyData.selectedDay - 14;
        var iStart = 0;
        var id = tableIds[row][i0];
        //Это функция кринжа. Почему-то без вынесения её вне цикла оно считает, что -1 !== -1;
        function idNotId(id)
        {
            return (<TableCell colSpan={i - iStart} sx={{padding: '6px', textAlign: "center", height: "40px", textOverflow: "ellipsis"}}>
                        <Box
                            sx = {{bgcolor: theme.palette.blue.light + '33'}} 
                            style = {{
                            display: "flex",
                            height: "100%",
                            padding: "4px",
                            borderRadius:"10px"}}>
                            <AutoSizer>
                                {({height, width}) => (
                                    <Box sx = {{height: height, width: width, display: "flex"}}>
                                        <Typography color={theme.palette.blue.dark} gutterBottom sx={{margin:"auto"}} fontWeight="500" noWrap>
                                            {namesById.get(id).surname + ' ' + namesById.get(id).name}
                                        </Typography>
                                    </Box>
                                )}
                            </AutoSizer>
                        </Box>
                        </TableCell>);
        }
        for (var i = 1; i < COLUMNS; i++){
            if(id === -1){
                result.push(<TableCell colSpan={1} sx = {{
                    padding: '0px', 
                    textAlign: "center", 
                    height: "40px",
                    textOverflow: "ellipsis"}}></TableCell>);
                if(tableIds[row][i0 + i] === -1){
                    continue;
                }
                id = tableIds[row][i0 + i];
                iStart = i;
                continue;
            }

            if(tableIds[row][i0 + i] === id){
                continue;
            }

            result.push(idNotId(id));

            if(tableIds[row][i0 + i] === -1){
                id = -1;
                iStart = -1;
                continue;
            }

            id = tableIds[row][i0 + i];
            iStart = i;
        }
        if (id === -1){
            result.push(<TableCell colSpan={1} sx = {{padding: '0px', textAlign: "center", height: "40px"}}></TableCell>);
        }
        if (id !== -1){
            result.push(idNotId(id));
        }
        return result;
    }

    function fillCells(){
        var result = [];
        for (var i = 0; i < ROWS; i++)
        {
            result.push(<TableRow> {fillRow(i)} </TableRow>);
        }
        return result;
    }

    return (
        <Box sx={{width:"100%", padding: "10px", boxSizing: "border-box"}}>
            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ width:"100%", padding: "200px"}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {[...Array(COLUMNS)].map((x, i) =>
                                <TableCell align = "center" sx = {{
                                    writingMode: "vertical-rl",
                                    padding: "0px",
                                    whiteSpace: "nowrap",
                                    height: "100px",
                                }}>
                                    {getDate(i)}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fillCells()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}