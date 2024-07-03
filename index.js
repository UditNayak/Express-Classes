const express = require('express');
const app = express();

app.use(express.json());

let courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/courses', (req, res) => {
    res.json(courses);
});

app.post('/courses', (req, res) => {
    console.log(req.body);
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.json(course);
});

app.listen(3000, () => console.log('Server Started on port 3000...'));