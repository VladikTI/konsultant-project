import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Button, TextField} from "@mui/material";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Добавить отдел" {...a11yProps(0)} />
                    <Tab label="Изменить отдел" {...a11yProps(1)} />
                    <Tab label="Удалить отдел" {...a11yProps(2)} />
                    <Tab label="Добавить сотрудника вне отдела" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <form>
                    <Box marginBottom={2}>
                    <TextField
                        label="Имя"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Фамилия"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                        <Box marginBottom={2}>
                    <TextField
                        label="Отчество"
                        variant="outlined"
                        fullWidth
                    />
                        </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Должность"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        type="password"
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="ID отдела"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Доступные дни отпуска"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="ID роли"
                        variant="outlined"
                        fullWidth
                    />
                    </Box>
                </form>
                <form><Button
                    variant="contained"
                    color="primary"
                    style={{ position: 'absolute', right: '40px' }}
                >
                    Добавить
                </Button>
                </form>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                Item Four
            </CustomTabPanel>
        </Box>
    );
}