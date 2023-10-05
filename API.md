# API приложения

## 1. Статичные страницы

### 1.1. Главная страница
```
{
    method: 'GET',
    url: "/",
    headers: {
        'Accept': 'text/html; charset=Utf-8',
    },
}
```

### 1.2. Страница авторизации
```
{
    method: 'GET',
    url: "/auth/",
    headers: {
        'Accept': 'text/html; charset=Utf-8',
    },
}
```

## 2. Авторизация

### 2.1. Запрос авторизации
```
{
    method: 'POST',
    url: {authorization_server_url},
    headers: {
        'Content-Type': 'application/json'
    },
    body: {
        "username": USERNAME,
        "password": PASSWORD
    }
}
```

| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _username_ | Имя пользователя. | **string** ||
| _password_ | Пароль. | **string** ||

#### Ответ:

```
{
    token: "example_token",
    refresh_token: "example_refresh_token",
    token_expire_date: "0000-00-00T00:00:00",
    refresh_token_expire_date: "0000-00-00T00:00:00"
}
```

| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _token_ | Токен аутентификации. | **string** | Токен в формате JWT |
| _refresh_token_ | Токен повторной аутентификации. | **string** | Токен в формате JWT |
| _token_expire_date_ | Срок действия токена аутентификации. | **string** | Время в формате YYYY-MM-DDTHH:MM:SS |
| _refresh_token_expire_date_ | Срок действия токена повторной аутентификации. | **string** | Время в формате YYYY-MM-DDTHH:MM:SS |

## 3. Отображение расписания

### 3.1. Получение данных сотрудников
```
{
    method: 'GET',
    url: {employees_storage_url},
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
}
```

### 3.1.1. Ответ сервера
```
{
    "status": STATUS, 
    "message": MSG,
    "data": [{
            "employee_id": EMPLOYEE_ID,
            "name": NAME
        }]
}
```

| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _employee_id_ | ID сотрудника | **int** ||
| _name_ | Имя сотрудника | **string** ||

### 3.2. Получение заявок сотрудников
```
{
    method: 'GET',
    url: {application_proccessing_service_url},
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        Content-Type: 'application/json',
    },
    body: {
        "employees": [{"employee_id": EMPLOYEE_ID}]
    }
}
```

### 3.2.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG,
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
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _employee_id_ | ID сотрудника | **int** ||
| _start_date_ | Дата начала отпуска | **string** | Дата в формате YYYY-MM-DD |
| _amount_days_ | Количество дней отпуска | **int** ||
| _status_ | Статус заявления | **int** | -1: Отказано; 0: На рассмотрении; 1: Одобрена |

## 4. API Сотрудника

### 4.1. Подача заявки на отпуск
```
{
    method: 'POST',
    url: {application_proccessing_service_url},
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        Content-Type: 'application/json'
    },
    body: {
        "employee_id": EMPLOYEE_ID,
        "start_date" : START_DATE,
        "end_date" : END_DATE,
        "amount_days" : AMOUNT_DAYS
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _employee_id_ | ID сотрудника | **int** ||
| _start_date_ | Дата начала отпуска | **string** | Дата в формате YYYY-MM-DD |
| _end_date_ | Дата окончания отпуска | **string** | Дата в формате YYYY-MM-DD |
| _amount_days_ | Желаемое количество дней отпуска | **int** ||

### 4.1.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG,
    "data": {"application_id": APPLICATION_ID}
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _application_id_ | ID заявки | **int** ||


### 4.2. Загрузка неподписанного документа с сервера в формате .pdf
```
{
    method: 'POST',
    url: {application_document_generator_service_url},
    headers: {
        Accept: 'application/pdf',
        Authorization: `Bearer ${token}`
    }
    body: {
        "application_id": "APPLICATION_ID"
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _application_id_ | ID заявки | **int** ||

### 4.2.1. Ответ сервера
```
{
    status: STATUS,
    message: MSG,
    url: {application_document_generator_service_url/example.pdf},
    Content-Type: 'application/pdf',
    Content-Disposition: 'attachment; filename="example.pdf"',
}
```

### 4.3. Загрузка подписанного документа на сервер
```
{
    method: 'POST',
    url: {application_document_store_service_url},
    headers: {
        Authorization: `Bearer &{token}`,
        Content-Type: 'multipart/form-data'
    }
    body: formData
}
```

### 4.3.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG
}
```

### 4.4. Удаление заявки
```
{
    method: 'POST',
    url: {application_proccessing_service_url},
    headers: {
        Authorization: `Bearer ${token}`,
        Content-Type: 'application/json'
    }
    body: {
        "application_id": "APPLICATION_ID"
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _application_id_ | ID заявки | **int** ||

### 4.4.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG
}
```

## 5. API руководителя

### 5.1. Получение информации о сотруднике
*Пункт 3 для этих целей*

### 5.2. Согласование заявки сотрудника
```
{
    method: 'POST',
    url: {application_proccessing_service_url},
    headers: {
        Authorization: `Bearer ${token},
        Content-Type: 'application/json'
    },
    body: {
        "application_id": APPLICATION_ID,
        "decision": DECISION,
        "comment": COMMENT
    }
}
```

| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _application_id_ | ID заявки | **int** ||
| _decision_ | Решение по заявке | **int** | -1: Отказать; 1: Одобрить |
| _comment_ | Комментарий по решению | **string** ||

### 5.2.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```

### 5.3. Создание нового правила руководителем
```
{
    method: 'POST',
    url: {rule_managment_service_url},
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        Content-Type: 'application/json'
    },
    body: {
        "employees_ids": [{"id": ID}],
        "rule": "RULE",
        "expiration_date": "EXPIRATION_DATE"
        "status": "STATUS"
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _id_ | ID сотрудника | **int** ||
| _rule_ | Правило | **string** ||
| _expiration_date_ | Дата прекращения действия правила | **string** | Дата в формате YYYY-MM-DD |
| _status_ | Статус правила | **boolean** | true: Правило активно; false: Правило неактивно |


### 5.3.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```

### 5.4. Загрузка отчёта с сервера
```
{
    method: 'POST',
    url: {application_document_store_service_url},
    headers: {
        Accept: 'application/pdf',
        Authorization: `Bearer ${token}`
    }
    body: {
        "application_id": "APPLICATION_ID"
    }
} 
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _application_id_ | ID заявки | **int** ||

### 5.4.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```

### 5.5. Получение всех сотрудников из базы для вывода на экран
```
{
    method: 'GET',
    url: {employees_storage_url},
    headers:{
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    }
}
```

### 5.5.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG, 
    "data":{
        [{
            "employee_id": EMPLOYEE_ID,
            "name": NAME,
            "position": POSITION,
            "unit": UNIT
        }]
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _employee_id_ | ID сотрудника | **int** ||
| _name_ | ФИО сотрудника | **string** ||
| _position_ | Должность сотрудника | **string** ||
| _unit_ | Подразделение | **string** ||

### 5.6. Получение всех подразделений для вывода на экран
```
{
    method: 'GET',
    url: {units_storage_url},
    headers:{
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    }
}
```

### 5.6.1 Ответ сервера
```
{
    "status": STATUS,
    "message": MSG, 
    "data":{
        [{"name": NAME}]
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _name_ | Название подразделения | **string** ||

### 5.7. Добавление нового сотрудника
```
{
    method: 'POST',
    url: {employees_storage_url},
    headers:{
        Authorization: `Bearer ${token}`,
        Content-Type:'application/json; charset=utf-8'
    },
    body: {
        "name": NAME,
        "position": POSITION,
        "unit": UNIT
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _name_ | ФИО сотрудника | **string** ||
| _position_ | Должность сотрудника | **string** ||
| _unit_ | Подразделение | **string** ||


### 5.7.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```

### 5.8. Добавление нового подразделения
```
{
    method: 'POST',
    url: {units_storage_url},
    headers:{
        Authorization: `Bearer ${token}`,
        Content-Type:'application/json; charset=utf-8'
    },
    body: {
        "name": NAME
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _name_ | Название подразделения | **string** ||


### 5.8.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```

### 5.9. Редактирование информации о сотруднике
```
{
    method: 'POST',
    url: {employees_storage_url},
    headers:{
        Authorization: `Bearer ${token}`,
        Content-Type:'application/json; charset=utf-8'
    },
    body: {
        "name": NAME,
        "position": POSITION,
        "unit": UNIT
    }
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _name_ | ФИО сотрудника | **string** ||
| _position_ | Должность сотрудника | **string** ||
| _unit_ | Подразделение | **string** ||

### 5.9.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```

### 5.10 Редактирование информации о подразделении
```
{
    method: 'POST',
    url: {units_storage_url},
    headers:{
        Authorization: `Bearer ${token}`,
        Content-Type:'application/json; charset=utf-8'
    },
    body: {"name": NAME}
}
```
| Поле | Описание | Тип данных | Примечания |
|------|----------|------------|------------|
| _name_ | Название подразделения | **string** ||

### 5.10.1. Ответ сервера
```
{
    "status": STATUS,
    "message": MSG  // опциональное поле для сообщения об ошибке
}
```