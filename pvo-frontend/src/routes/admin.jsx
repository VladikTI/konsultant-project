import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Alert, Autocomplete, Button, TextField} from "@mui/material";
import axios from "axios";
import {useState} from "react";
import { useTheme } from '@mui/material/styles';

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
    const token = localStorage.getItem('token');
    // const [employeeData, setEmployeeData] = React.useState({
    //     name: null,
    //     surname: null,
    //     patronymic: null,
    //     position: null,
    //     username: null,
    //     password: null,
    //     unit_id: null,
    //     available_vacation: null,
    //     role_id: 2,
    // });
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [position, setPosition] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [unit_id, setUnitId] = useState("");
    const [available_vacation, setAvailableVacation] = useState("");
    const [role_id, setRoleId] = useState(2);
    const [error, setError] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //
    // const handleInputCh3ange = (event) => {
    //     const { name, value } = event.target;
    //     setEmployeeData({ ...employeeData, [name]: value });
    // };
    //
    // const handleInputRoleChange = (event, value) => {
    //     // Обработчик события при выборе роли
    //     if (value) {
    //         setEmployeeData({...employeeData, role_id: value.id});
    //     } else {
    //         setEmployeeData({...employeeData, role_id: null});
    //     }
    // };



    async function fetchUnitData() {
        const unitsData = {};
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/get_units'); // Укажите URL вашего сервера
            const unitsData = response.data; // JSON-данные, полученные от сервера
            console.log(unitsData);
        } catch (error) {
            // Обработка ошибок, если GET-запрос не удался
            console.error('Ошибка при выполнении GET-запроса:', error);
        }
        return unitsData;
    }

    const handleAddEmployee = async (event) => {
        event.preventDefault();
        if (!username || !password || !name || !surname || !patronymic || !role_id || !unit_id
            || !available_vacation || !position) {
            setError("Пожалуйста, заполните все поля");
            return;
        }
        setError("");


        // clear the errors
        setError("");
        axios
            .post('http://127.0.0.1:3000/api/add_employee', {username: username, password: password, name: name,
            surname: surname, patronymic: patronymic, position: position, available_vacation: available_vacation,
            unit_id: unit_id, role_id: role_id}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((response) => {
                // Обработка успешного ответа от сервера
            })
            .catch((error) => {
                console.error('Ошибка при отправке запроса:', error);
            });
    };

    const roles = [{ id: 1, name: 'Руководитель' },
        { id: 2, name: 'Сотрудник' }];

    const units = fetchUnitData();

    const theme = useTheme();

    //Можно более аккуратно цвета настроить через стиль, но я этим сейчас заниматься не буду // 25.10.2023 6:43
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs textColor="secondary" value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Добавить отдел" {...a11yProps(0)} />
                    <Tab label="Добавить сотрудника" {...a11yProps(1)} />
                    <Tab label="Удалить отдел" {...a11yProps(2)} />
                    <Tab label="Добавить сотрудника вне отдела" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel color={theme.palette.blue.dark} value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {error && <Alert severity="error" sx={{my: 2}}>{error}</Alert>}
                <form>
                    <Box marginBottom={2}>
                    <TextField
                        label="Имя"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Фамилия"
                        variant="outlined"
                        fullWidth
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    </Box>
                        <Box marginBottom={2}>
                    <TextField
                        label="Отчество"
                        variant="outlined"
                        fullWidth
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                    />
                        </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Должность"
                        variant="outlined"
                        fullWidth
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Доступные дни отпуска"
                        variant="outlined"
                        fullWidth
                        value={available_vacation}
                        onChange={(e) => setAvailableVacation(e.target.value)}
                    />
                    </Box>
                    <Box marginBottom={2}>
                        <TextField
                            label="ID роли"
                            variant="outlined"
                            fullWidth
                            value={role_id}
                            onChange={(e) => setRoleId(e.target.value)}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <TextField
                            label="ID отдела"
                            variant="outlined"
                            fullWidth
                            value={unit_id}
                            onChange={(e) => setUnitId(e.target.value)}
                        />
                    </Box>
                </form>
                <form><Button
                    variant="contained"
                    color="primary"
                    style={{ position: 'absolute', right: '40px' }}
                    onClick={handleAddEmployee}
                >
                    Добавить
                </Button>
                </form>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                Item Four
            </CustomTabPanel>
        </Box>
    );
}