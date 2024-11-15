# Employee Management Tracker System

This is a command-line application that allows you to manage ande edi employees, roles, and departments in a company. The application provides functionalities to view, add, update, and delete employees, roles, and departments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Video](#video)
- [Questions](#questions)


## Installation

1. Install the dependencies:
    ```
    npm install
    ```

2. Set up the database:
    - Create a `.env` file in the root directory and add your database configuration:
        ```
        DB_USER=<your-database-username>
        DB_PASSWORD=<your-database-password>
        DB_HOST=<your-database-host>
        DB_NAME=employee_tracker_db
        DB_PORT=5432
        ```
    - Run the database schema and seed files:
        ```sh
        psql -U <your-database-username> -f db/schema.sql
        psql -U <your-database-username> -f db/seeds.sql
        ```

## Usage

Start the application:
```
npm start
```

## License 

This project is licensed under the MIT License.

## Video

Challenge Video Link:

https://drive.google.com/file/d/1xYOd_EMtdDe1QtNXawBB9d-dv01xCa0V/view?usp=drive_link

## Questions 

For any questions, please contact me through: 

GitHub: [kevinNoguera](https://github.com/KevNoguera)

Email: noguera.ke@gmail.com

