import { 
    Box, 
    Typography
} from "@mui/material";

import { useTheme } from '@mui/material/styles';

import DateSlider from "../../components/apply/dateSlider";
import DateTable from "../../components/apply/dateTable";

export default function Timeline({remoteData, applyData, setRemoteData, setApplyData}){
    const theme = useTheme();
    
    var year = new Date().getFullYear() + 1;

    return (
        <Box sx={{height: "100%", display: "flex", flexDirection: "column", flex: "auto"}}>
            <Box sx={{height: "100px", display: "flex", alignItems: "center"}}>
                <Typography variant="h3" fontWeight="600" gutterBottom color={theme.palette.blue.dark} sx={{margin: "auto"}}>
                    {year}
                </Typography>
            </Box>
            <DateSlider remoteData={remoteData} applyData={applyData} setApplyData={setApplyData} setRemoteData={setRemoteData}/>
            <DateTable remoteData={remoteData} applyData={applyData} setApplyData={setApplyData} setRemoteData={setRemoteData}/>
        </Box>            
    );
}