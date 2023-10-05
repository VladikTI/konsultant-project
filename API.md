# API приложения

## 1. Статичные страницы

### 1.1. Главная страница
```
{
    method: 'GET',
    url: "/",
    headers: {
        'Accept': 'text/html'; charset=Utf-8,
    },
}
```

### 1.2. Страница авторизации
```
{
    method: 'GET',
    url: "/auth/",
    headers: {
        'Accept': 'text/html'; charset=Utf-8,
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
        "username": "USERNAME",
        "password": "PASSWORD"
    }
}
```

Ответ:

```
{
    token: "example_token",
    refresh-token: "example_refresh_token",
    expire-date: "0000-00-00T00:00:00",
    refresh-date: "0000-00-00T00:00:00"
}
```

## 3. API Сотрудника

### 3.1. Получение информации об отпусках сотрудника
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
        "employee_id": "EMPLOYEE_ID"
    }
}
```

### 3.2. Подача заявки на отпуск
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
        "employee_id": "EMPLOYEE_ID",
        "start_date" : "START_DATE",
        "end_date" : "END_DATE",
        "amount_days" : "AMOUNT_DAYS"
    }
}
```

### 3.3. Загрузка неподписанного документа с сервера 
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

### 3.4. Загрузка подписанного документа на сервер
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

### 3.5. Удаление заявки
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

## 4. API руководителя

### 4.1. Получение информации о сотруднике 
```
{
    method: 'GET',
    url: {application_proccessing_service_url},
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    },
    body: {
        "employee_id": "EMPLOYEE_ID"
    }
}
```

### 4.2. Согласование заявки сотрудника
```
{
    method: 'PUT',
    url: {application_proccessing_service_url},
    headers: {
        Authorization: `Bearer ${token},
        Content-Type: 'application/json'
    },
    body: {
        "application_id": "APPLICATION_ID",
        "decision": "DECISION",
        "comment": "COMMENT"
    }
}
```

### 4.3. Создание правила
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

### 4.4 Загрузка отчёта
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