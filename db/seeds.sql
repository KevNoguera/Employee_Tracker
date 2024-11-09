INSERT INTO department (name) VALUES 
('Film'), 
('Photography'),
('Design');

INSERT INTO roles (job_title, salary, department_id) VALUES
('Director', 1000000, 1),
('Photographer', 75000, 2),
('Graphic Designer', 55000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Steven', 'Lawrence', 1, NULL),
('Lucy', 'Niland', 02, 02),
('Paul', 'Michaels', 03, 03);