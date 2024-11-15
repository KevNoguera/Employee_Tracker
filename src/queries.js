import pool from './connection.js'; 


export const getDepartments = async () => {
  const res = await pool.query('SELECT * FROM department');
  return res.rows;
};


export const getRoles = async () => {
  const query = `
    SELECT r.id, r.title, d.name AS department_name,
           to_char(r.salary, 'FM$999,999,999.00') AS "Salary"
    FROM roles r
    JOIN department d ON r.department_id = d.id
  `;
  const res = await pool.query(query);
  return res.rows;
};

export const getEmployees = async () => {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS role_title, r.salary, d.name AS department_name, 
           CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    JOIN roles r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `;
  const res = await pool.query(query);
  return res.rows;
};

export const getManagers = async () => {
  const query = `
    SELECT DISTINCT e.id, e.first_name, e.last_name
    FROM employee e
    JOIN employee m ON e.id = m.manager_id
  `;
  const res = await pool.query(query);
  return res.rows;
};

export const getEmployeeDetails = async () => getEmployees(); 

export const getRoleDetails = async () => {
  const query = `
    SELECT r.id, r.title, r.salary, d.name AS department_name
    FROM roles r
    JOIN department d ON r.department_id = d.id
  `;
  const res = await pool.query(query);

  return res.rows.map(role => ({
    ...role,
    salary: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(role.salary)
  }));
};


export const getEmployeesByDepartmentId = async (departmentId) => {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS role_title, r.salary, d.name AS department_name, 
           CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    JOIN roles r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    WHERE d.id = $1
  `;
  const res = await pool.query(query, [departmentId]);
  return res.rows;
};


export const addDepartment = async (name) => {
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
};


export const addRole = async (title, salary, department_id) => {
  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};


export const addEmployee = async ({ first_name, last_name, role_id, manager_id }) => {
  const truncatedFirstName = first_name.slice(0, 30);
  const truncatedLastName = last_name.slice(0, 30);

  const query = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [truncatedFirstName, truncatedLastName, role_id, manager_id];

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error adding employee:', err);
    throw err;
  }
};


export const getEmployeesByRoleId = async (roleId) => {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name
    FROM employee e
    JOIN roles r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    WHERE e.role_id = $1
  `;
  const res = await pool.query(query, [roleId]);
  return res.rows;
};


export const getEmployeesByManagerId = async (managerId) => {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS role_title, r.salary, d.name AS department_name
    FROM employee e
    JOIN roles r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    WHERE e.manager_id = $1
  `;
  const res = await pool.query(query, [managerId]);
  return res.rows;
};


export const modifyEmployee = async (employeeId, updates) => {
  const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = [...Object.values(updates), employeeId];

  const query = `
    UPDATE employee
    SET ${setClause}
    WHERE id = $${values.length}
  `;
  await pool.query(query, values);
};


export const deleteEmployee = async (employeeId) => {
  await pool.query('UPDATE employee SET manager_id = NULL WHERE manager_id = $1', [employeeId]);
  await pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
};


export const deleteRole = async (roleId) => {
  await pool.query('DELETE FROM roles WHERE id = $1', [roleId]);
};


export const deleteDepartment = async (departmentId) => {
  await pool.query('DELETE FROM department WHERE id = $1', [departmentId]);
};


export const getDepartmentBudget = async (departmentId) => {
  const query = `
    SELECT SUM(r.salary) AS total_budget
    FROM employee e
    JOIN roles r ON e.role_id = r.id
    WHERE r.department_id = $1
  `;
  const res = await pool.query(query, [departmentId]);
  const totalBudget = res.rows[0].total_budget;

  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBudget);
};

export const getEmployeesWithNoManagerOption = async () => {
  const query = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS name
    FROM employee
  `;
  const res = await pool.query(query);
  const employees = res.rows;

  employees.unshift({ id: null, name: 'No Manager' });

  return employees;
};
