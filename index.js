const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(customLogger);

const coursesFilePath = path.join(__dirname, 'courses.json');

// Custom logger middleware
function customLogger(req, res, next) {
    console.log(
        `Method: ${req.method}, IP: ${req.ip}, Hostname: ${req.hostname}, Date: ${new Date()}`
    );
    next();
}

// Utility function to read courses from the file
function readCoursesFromFile() {
    const data = fs.readFileSync(coursesFilePath, 'utf-8');
    return JSON.parse(data);
}

// Utility function to write courses to the file
function writeCoursesToFile(courses) {
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2));
}

app.get("/courses", (req, res) => {
    const courses = readCoursesFromFile();
    res.json(courses);
});

app.post("/courses", (req, res) => {
    const courses = readCoursesFromFile();
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    writeCoursesToFile(courses);
    res.json(course);
});

app.put("/courses/:id", (req, res) => {
    const courses = readCoursesFromFile();
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("The course with the given ID was not found");

    course.name = req.body.name;
    writeCoursesToFile(courses);
    res.json(course);
});

app.delete("/courses/:id", (req, res) => {
    let courses = readCoursesFromFile();
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("The course with the given ID was not found");

    courses = courses.filter((c) => c.id !== parseInt(req.params.id));
    writeCoursesToFile(courses);
    res.json(course);
});

app.listen(3000, () => console.log("Server Started on port 3000..."));
