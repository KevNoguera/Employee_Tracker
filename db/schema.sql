DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

\c employeeTracker_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY, 
    employee_name VARCHAR (30) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    job_title, VARCHAR (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL
)