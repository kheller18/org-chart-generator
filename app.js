const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// question to get the name of the employee
const employeeQuestions = {
    type: "input",
    name: "name",
    message: "What is the employee's name?",
    validate: (name) => name !== "" && name !== null && name !== undefined,
}

// function to prompt the user for basic questions about them
function getBaseQuestions(employeeName) {
    return [
        {
            type: "input",
            name: "id",
            message: `What is the ID for ${ employeeName }?`,
            validate: (name) => name !== "" && name !== null && name !== undefined,
        },
        {
            type: "input", 
            name: "email",
            message: `What is the email for ${ employeeName }?`,
            validate: (name) => name !== "" && name !== null && name !== undefined,
        },
        {
            type: "list",
            name: "role",
            message: `What is the role of ${ employeeName }?`,
            choices: ['Manager', 'Engineer', 'Intern'],
            default: "Engineer",
            validate: (name) => name !== "" && name !== null && name !== undefined,
        }
    ];
}

// prompts the user for questions based on their job role
function getSpecificQuestions(employeeName, employeeRole) {
    return [
        {
            type: "input",
            name: "roleSpecific",
            message: `What school does ${ employeeName } attend?`,
            validate: (name) => name !== "" && name !== null && name !== undefined,
            when: () => employeeRole == "Intern"
        },
        {
            type: "input",
            name: "roleSpecific",
            message: `What is ${ employeeName }'s GitHub?`,
            validate: (name) => name !== "" && name !== null && name !== undefined,
            when: () => employeeRole == "Engineer"
        },
        {
            type: "input",
            name: "roleSpecific",
            message: `What is the office number of Manager ${ employeeName }?`,
            validate: (name) => name !== "" && name !== null && name !== undefined,
            when: () => employeeRole == "Manager"
        }
    ]
}

// boolean to keep adding employees
const addAdditionalEmployee = {
    type: "confirm",
    name: "confirmAddEmployee",
    message: "Do you want to add another employee?",
    validate: (name) => name !== "" && name !== null && name !== undefined,
}

// function that runs the application
async function init() {
    let addEmployee = true;
    let employees = [];
    
    while (addEmployee) {
        let name, id, email, role, roleSpecific, teamMember;
        await inquirer.prompt(employeeQuestions) 
            .then(response => {name = response.name})
            .catch(error => console.log(error));
        
        await inquirer.prompt(getBaseQuestions(name))
            .then(response => {
                id = response.id;
                email = response.email;
                role = response.role;
            })
            .catch(error => console.log(response.error));

        await inquirer.prompt(getSpecificQuestions(name, role))
            .then(response => {roleSpecific = response.roleSpecific})
            .catch(error => console.log(error));
        
        switch (role) {
            case "Manager":
                teamMember = new Manager(name, id, email, roleSpecific);
                break;
            case "Engineer":
                teamMember = new Engineer(name, id, email, roleSpecific);
                break;
            case "Intern":
                teamMember = new Intern(name, id, email, roleSpecific);
                break;
            default:
                teamMember = new Engineer(name, id, email, roleSpecific);
                break;
        }

        employees.push(teamMember);
        await inquirer.prompt(addAdditionalEmployee)
            .then(response => {
                addEmployee = response.confirmAddEmployee;
                console.log("\n");
            })
                
            .catch(error => console.log(error));
    }
    console.log(employees);
    await fs.writeFile(outputPath, render(employees), function(error) {
        if (error) {
            return console.log(error);
        }
        console.log(employees)
    });
}

// kicks off the application
init();