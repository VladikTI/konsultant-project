import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Autocomplete, Button, TextField} from "@mui/material";
import axios from "axios";

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
    const [employeeData, setEmployeeData] = React.useState({
        name: null,
        surname: null,
        patronymic: null,
        position: null,
        username: null,
        password: null,
        unit_id: null,
        available_vacation: null,
        role_id: 2,
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleInputRoleChange = (event, value) => {
        // Обработчик события при выборе роли
        if (value) {
            setEmployeeData({...employeeData, role_id: value.id});
        } else {
            setEmployeeData({...employeeData, role_id: null});
        }
    };

    async function fetchUnitData() {
        try {
            const response = await axios.get('/api/get_units'); // Укажите URL вашего сервера
            const unitsData = response.data; // JSON-данные, полученные от сервера

            console.log(unitsData);
        } catch (error) {
            // Обработка ошибок, если GET-запрос не удался
            console.error('Ошибка при выполнении GET-запроса:', error);
        }
    }

    const handleAddEmployee = () => {
        axios
            .post('/api/add_employee', employeeData, {
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


    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Добавить отдел" {...a11yProps(0)} />
                    <Tab label="Добавить сотрудника" {...a11yProps(1)} />
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
                        value={employeeData.name}
                        onChange={handleInputChange}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Фамилия"
                        variant="outlined"
                        fullWidth
                        value={employeeData.surname}
                        onChange={handleInputChange}
                    />
                    </Box>
                        <Box marginBottom={2}>
                    <TextField
                        label="Отчество"
                        variant="outlined"
                        fullWidth
                        value={employeeData.patronymic}
                        onChange={handleInputChange}
                    />
                        </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Должность"
                        variant="outlined"
                        fullWidth
                        value={employeeData.position}
                        onChange={handleInputChange}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                        value={employeeData.username}
                        onChange={handleInputChange}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={employeeData.password}
                        onChange={handleInputChange}
                    />
                    </Box>
                    <Box marginBottom={2}>
                    <TextField
                        label="Доступные дни отпуска"
                        variant="outlined"
                        fullWidth
                        value={employeeData.available_vacation}
                        onChange={handleInputChange}
                    />
                    </Box>
                    <Box marginBottom={2}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={roles}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Роль" />}
                            value={roles.find((role) => role.id === employeeData.role_id) || ''}
                            onChange={handleInputRoleChange}
                            getOptionLabel={(option) => option.name}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <TextField
                            label="ID отдела"
                            variant="outlined"
                            fullWidth
                            value={employeeData.unit_id}
                            onChange={handleInputChange}
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