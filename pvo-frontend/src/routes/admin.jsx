import React from 'react';
import './styles/style.css';
function Admin() {
    return (
        <div className="centered-container">
            <button className="blue-button">Создать отдел</button>
            <button className="blue-button">Редактировать отдел</button>
            <button className="blue-button">Удалить отдел</button>
            <button className="blue-button">Добавить сотрудника вне отдела</button>
        </div>
    );
}

export default Admin;
