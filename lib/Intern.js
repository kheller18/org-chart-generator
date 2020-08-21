// TODO: Write code to define and export the Intern class.  HINT: This class should inherit from Employee.
const Employee = require("./Employee");

class Intern extends Employee {
    constructor(id, email, name, school) {
        super(id, email, name, "Intern");
        this.school = school;
    }
    
    getSchool() {
        return this.school;
    }
}

module.exports = Intern;