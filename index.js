import inquirer from 'inquirer';
import { 
    getDepartments, 
    getRoles, 
    getEmployees, 
    getManagers,
    getEmployeesByManagerId, 
    getEmployeesByDepartmentId, 
    getDepartmentBudget, 
    addDepartment, 
    addRole, 
    addEmployee,
    modifyEmployee, 
    deleteEmployee, 
    deleteRole, 
    deleteDepartment 
} from './src/queries.js';

const welcomeMessage = () => {
    console.log(`Welcome to the Employee Management Tracker System!`);
};


const mainMenu = async () => {
  const { options } = await inquirer.prompt([{
    type: 'list',
    name: 'options',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'View Employees by Manager',
      'View Employees by Department',
      'View Department Budget',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Delete Employee',
      'Delete Role',
      'Delete Department',
      'Exit'
    ]
  }
]);
switch (options) {
    case 'View All Departments':
      return viewAllDepartments();
    case 'View All Roles':
      return viewAllRoles();
    case 'View All Employees':
      return viewAllEmployees();
    case 'View Employees by Manager':
      return viewEmployeesByManager();
    case 'View Employees by Department':
      return viewEmployeesByDepartment();
    case 'View Department Budget':
      return viewDepartmentBudget();
    case 'Add Department':
      if (await confirmAction('Are you sure you want to add a new department?')) {
        return addNewDepartment();
      }
      break;
    case 'Add Role':
      if (await confirmAction('Are you sure you want to add a new role?')) {
        return addNewRole();
      }
      break;
    case 'Add Employee':
      if (await confirmAction('Are you sure you want to add a new employee?')) {
        return addNewEmployee();
      }
      break;
    case 'Update Employee Role':
      return updateEmployeeRole();
    case 'Delete Employee':
      if (await confirmAction('Are you sure you want to delete an employee?')) {
        return removeEmployee();
      }
      break;
      case 'Delete Role':
        if (await confirmAction('Are you sure you want to delete a role?')) {
          return removeRole();
        }
      break;
    case 'Delete Role With Check':
      return deleteRoleWithCheck();
    case 'Delete Department':
      if (await confirmAction('Are you sure you want to delete a department?')) {
        return removeDepartment();
      }
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }
  mainMenu();
};

const viewAllDepartments = async () => {
  const departments = await getDepartments();
  console.table(departments);
  mainMenu();
};


const viewAllRoles = async () => {
    const roles = await getRoles();
    console.table(roles.map(role => ({
      ID: role.id,
      Title: role.title,
      Department: role.department_name,
      Salary: role.Salary
    })));
    mainMenu();
  };


const viewAllEmployees = async () => {
    const employees = await getEmployees();
    console.table(employees.map(employee => ({
      ID: employee.id,
      'First Name': employee.first_name,
      'Last Name': employee.last_name,
      Role: employee.role_title,
      Department: employee.department_name,
      Manager: employee.manager_name || 'None',
      Salary: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(employee.salary)
    })));
    mainMenu();
  };


const addNewDepartment = async () => {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:'
      }
    ]);
    await addDepartment(name);
    console.log(`Added new department: ${name}`);
    mainMenu();
  };


const addNewRole = async () => {
  const departments = await getDepartments();
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the new role:'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the new role:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
  await addRole({ title, salary, department_id });
  console.log(`Added new roles: ${title} (${salary}) (${department_id})`); 
  mainMenu();
};



const addNewEmployee = async () => {
    const employee = await getEmployees();
    const roles = await getRoles();
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the new employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the new employee:',
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role for the new employee:',
        choices: roles.map(role => ({
          name: `${role.title} (${role.department_name})`,
          value: role.id,
        })),
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager for the new employee (optional):',
        choices: [{ name: 'None', value: null }, employee.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))],
      },
    ]);
  
    await addEmployee({ first_name, last_name, role_id, manager_id });
    console.log(`Added new employee: ${first_name} ${last_name}`);
    mainMenu();
  };


  const updateEmployeeRole = async () => {
    const employees = await getEmployees();
    const roles = await getRoles();
  
    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
    ]);
  
    const { roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role for the employee (or leave unchanged):',
        choices: [
          { name: 'Unchanged', value: null },
          ...roles.map(role => ({
            name: `${role.title} (${role.department_name}) - ${role.Salary}`,
            value: role.id,
          })),
        ],
      },
    ]);
  
    const { managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the new manager for the employee (or leave unchanged):',
        choices: [
          { name: 'Unchanged', value: null },
          ...employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        ],
      },
    ]);
  
    const updates = {};
    if (roleId !== null) updates.role_id = roleId;
    if (managerId !== null) updates.manager_id = managerId;
  
    if (Object.keys(updates).length > 0) {
      await modifyEmployee(employeeId, updates);
      console.log('Employee updated successfully.');
    } else {
      console.log('No changes made to the employee.');
    }
  
    mainMenu();
  };
  

const removeEmployee = async () => {
  const employees = await getEmployees();
  const { employee_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to remove:',
      choices: employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))
    }
  ]);
  await deleteEmployee(employee_id);
  console.log(`Removed employee`);
  mainMenu();
};


const removeRole = async () => {
  const roles = await getRoles();
  const { role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role to remove:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    }
  ]);
  await deleteRole(role_id);
  console.log(`Removed role`);
  mainMenu();
};


const removeDepartment = async () => {
  const departments = await getDepartments();
  const { department_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department to remove:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
  await deleteDepartment(department_id);
  console.log(`Removed department`);
  mainMenu();
};


const viewEmployeesByManager = async () => {
  const managers = await getManagers();
  const { managerId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the manager to view employees:',
      choices: managers.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id
      }))
    }
  ]);

  const employees = await getEmployeesByManagerId(managerId);
  console.table(employees.map(employee => ({
    ID: employee.id,
    'First Name': employee.first_name,
    'Last Name': employee.last_name,
    Role: employee.role_title,
    Department: employee.department_name,
    Salary: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(employee.salary)
  })));
  mainMenu();
};


const viewEmployeesByDepartment = async () => {
  const departments = await getDepartments();
  const { department_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department to view employees:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
  const employees = await getEmployeesByDepartmentId(department_id);
  console.table(employees);
  mainMenu();
};


const viewDepartmentBudget = async () => {
  const departments = await getDepartments();
  const { department_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department to view budget:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
  const budget = await getDepartmentBudget(department_id);
  console.log(`Total utilized budget for department: ${budget}`);
  mainMenu();
};


const confirmAction = async (message) => {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: message,
      default: false
    }
  ]);
  return confirm;
};


const deleteRoleWithCheck = async () => {
  const roles = await getRoles();

  const { roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role to remove:',
      choices: roles.map(role => ({
        name: `${role.title} (${role.department_name}) - ${role.Salary}`,
        value: role.id,
      })),
    },
  ]);

  const employees = await getEmployeesByRoleId(roleId);

  if (employees.length > 0) {
    console.log('The following employees are associated with this role:');
    console.table(employees);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Modify Employee Roles',
          'Delete Employees',
          'Cancel'
        ],
      },
    ]);

    if (action === 'Modify Employee Roles') {
      for (const employee of employees) {
        const { newRoleId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'newRoleId',
            message: `Select a new role for ${employee.first_name} ${employee.last_name}:`,
            choices: roles.map(role => ({
              name: `${role.title} (${role.department_name}) - ${role.Salary}`,
              value: role.id,
            })),
          },
        ]);
        await modifyEmployee(employee.id, { role_id: newRoleId });
      }
    } else if (action === 'Delete Employees') {
      for (const employee of employees) {
        await deleteEmployee(employee.id);
      }
    } else {
      return;
    }
  }

  await deleteRole(roleId);
  console.log('Role deleted successfully.');
  promptUser();
};


welcomeMessage();
mainMenu();