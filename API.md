# API приложения

## 0. Get a web-page of authorization
```
{
    method: 'GET',
    url: {url_page},
    headers: {
        'Accept': 'text/html'; charset=Utf-8,
    },
}
```

## 1. Authorization.

### 1.1. Request with credentials: login, password
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

### 1.2 Response with token

> TODO

## 2.  Get main page
```
{
    method: 'GET',
    url: {main_page},
    headers: {
        Accept: 'text/html',
        Authorization: `Bearer ${token}`
    }
}
```

## 3. Empolyee part

### 3.1 Get info about employee's vacations
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

### 3.2 Employee creating application for new vacation
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

### 3.3 Employee downloads application document
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

### 3.4 Employee uploads his application document 
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

### 3.5 Employee deletes his application
```
{
    method: 'DELETE',
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

## 4. Employer part

### 4.1 Get employees applications
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

### 4.2 Employer accepts or declines employee application
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

### 4.3 Employer creating new rule
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

### 4.4 Employer downloads application document
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

## 5. Administrator part

### 5.1. Get every employee
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

### 5.2 Get every employer 
> TODO
