import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Импортируйте Link

function EditingPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [position, setPosition] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [unit_id, setUnitId] = useState('');
    const [available_vacation, setAvailableVacation] = useState('');
    const [role_id, setRoleId] = useState('');
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/add_employee', {
                name,
                surname,
                patronymic,
                position,
                username,
                password,
                unit_id,
                available_vacation,
                role_id,
                token,
            });
            console.log('Employee added:', response.data);
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    }

    return (
        <div className="form_container">
            <form className="form1" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Фамилия"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
            />
            <input
                type="text"
                placeholder="Отчество"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value)}
            />
            <input
                type="text"
                placeholder="Должность"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="text"
                placeholder="ID подразделения"
                value={unit_id}
                onChange={(e) => setUnitId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Доступный отпуск"
                value={available_vacation}
                onChange={(e) => setAvailableVacation(e.target.value)}
            />
            <input
                type="text"
                placeholder="ID роли"
                value={role_id}
                onChange={(e) => setRoleId(e.target.value)}
            />
            <button type="submit">Добавить сотрудника</button>
        </form>
            <div>
            <Link to="/admin" className="back_link">Назад</Link> {/* Кнопка "назад" перенаправляет на страницу списка */}
            </div>
        </div>
    );
}

export default EditingPage;
