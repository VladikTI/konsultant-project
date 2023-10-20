INSERT INTO employee (
    name, 
    surname, 
    patronymic, 
    position, 
    username, 
    password,
    updated_date
) VALUES ('Admin', 'Admin', 'Admin', 'Admin', 'admin', '$2b$10$XXLk187ZPJU1OhhUw2.jEeFEYC4ufWO2fGuyEkGFRGdDhQoTm5gxm', NOW());

INSERT INTO role (
    name,
    updated_date,
    updated_by
) VALUES ('Employer', NOW(), 1), ('Employee', NOW(), 1);