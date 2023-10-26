drop table if exists employee, role, employee_role, 
unit, employee_unit, file, request, rule, authentication cascade;

drop index if exists idx_employee_username, idx_employee_surname,
idx_role_name, idx_employee_role_employee_id, idx_employee_role_role_id,
idx_unit_name, idx_employee_unit_employee_id, idx_employee_unit_unit_id,
idx_file_file_name, idx_file_file_type, idx_request_employee_id, 
idx_request_start_date, idx_request_end_date, idx_request_status,
idx_request_days, idx_rule_expiration_date, idx_rule_status,
idx_authentication_token_expire_date, idx_authentication_refresh_token_expire_date
cascade;

create table employee
(employee_id serial primary key, name varchar(50), surname varchar(50),
patronymic varchar(50), position varchar(50),
username varchar(50), password varchar(255),
available_vacation integer, updated_date timestamp,
updated_by integer, 
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_employee_username on employee (username);
create index idx_employee_surname on employee (surname);

create table role
(role_id serial primary key, name varchar(100),
updated_date timestamp, updated_by integer, 
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_role_name on role (name);

create table employee_role
(employee_id integer, role_id integer,
updated_date timestamp, updated_by integer, 
foreign key (employee_id) references employee (employee_id) on delete cascade on update cascade,
foreign key (role_id) references role (role_id) on delete cascade on update cascade,
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_employee_role_employee_id on employee_role (employee_id);
create index idx_employee_role_role_id on employee_role (role_id);

create table unit
(unit_id serial primary key, name varchar(100),
updated_date timestamp, updated_by integer, 
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_unit_name on unit (name);

create table employee_unit
(employee_id integer, unit_id integer,
updated_date timestamp, updated_by integer, 
foreign key (employee_id) references employee (employee_id) on delete cascade on update cascade,
foreign key (unit_id) references unit (unit_id) on delete cascade on update cascade,
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_employee_unit_employee_id on employee_unit (employee_id);
create index idx_employee_unit_unit_id on employee_unit (unit_id);

create table file
(file_id serial primary key, file_name varchar(100),
file_type varchar(50), file_path varchar,
updated_date timestamp, updated_by integer, 
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_file_file_name on file (file_name);
create index idx_file_file_type on file (file_type);

create table request(
request_id serial primary key, employee_id integer,
start_date date, end_date date,
days integer, status varchar(50),
comment text,
created_date timestamp, file_id integer,
updated_date timestamp, updated_by integer,
foreign key (employee_id) references employee (employee_id) on delete cascade on update cascade,
foreign key (file_id) references file (file_id) on delete set null on update cascade,
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_request_employee_id on request (employee_id);
create index idx_request_start_date on request (start_date);
create index idx_request_end_date on request (end_date);
create index idx_request_status on request (status);
create index idx_request_days on request (days);

create table rule
(rule_id serial primary key, rule_description varchar,
options text, expiration_date timestamp,
status varchar(50), updated_date timestamp,
updated_by integer, 
foreign key (updated_by) references employee (employee_id) on delete set null on update cascade
);

create index idx_rule_expiration_date on rule (expiration_date);
create index idx_rule_status on rule (status);

create table authentication
(employee_id integer, token varchar,
refresh_token varchar, token_expire_date timestamp, 
refresh_token_expire_date timestamp,
updated_date timestamp, updated_by integer, 
foreign key (employee_id) references employee (employee_id),
foreign key (updated_by) references employee (employee_id)
);

create index idx_authentication_token_expire_date on authentication (token_expire_date);
create index idx_authentication_refresh_token_expire_date on authentication (refresh_token_expire_date);


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

INSERT INTO employee_role ( employee_id, role_id, updated_date, updated_by) VALUES
(1, 1, NOW(), 1);

INSERT INTO unit (name, updated_date, updated_by) VALUES ('Unit 1', NOW(), 1);

INSERT INTO employee_unit (employee_id, unit_id, updated_date, updated_by) VALUES(1, 1, NOW(), 1);