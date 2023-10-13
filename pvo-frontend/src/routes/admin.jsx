import React from 'react';
import './styles/style.css';
import {Link} from 'react-router-dom';
function Admin() {
    return (
        <div className="centered-container">
            <Link to="/editing" className="blue-button">Создать отдел</Link>
            <Link to="/editing" className="blue-button">Редактировать отдел</Link>
            <Link to="/editing" className="blue-button">Удалить отдел</Link>
            <Link to="/editing" className="blue-button">Добавить сотрудника вне отдела</Link>
        </div>
    );
}
export default Admin;
