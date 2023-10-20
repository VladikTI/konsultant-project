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
) VALUES ('Unit 1', NOW(), 1), ('Unit 2', NOW(), 1);