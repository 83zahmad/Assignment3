/********************************************************************************
* BTI325 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: October 13th 2024
*
********************************************************************************/

const projectData = require("./modules/project");
const express = require('express');
const app = express();
const path = require('path');

// Set views and static files directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS correctly
app.get('/css/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'css', 'main.css'));
});

// Initialize data
projectData.initialize().then(() => {
    console.log("Project data initialized successfully.");
}).catch((error) => {
    console.log("Error initializing project data:", error);
});

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home'));
});

// Route for about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about'));
});

// Route for project by ID
app.get('/solutions/projects/:id', (req, res) => {
    const projectID = parseInt(req.params.id);
    projectData.getProjectById(projectID)
        .then(project => {
            res.send(project);
        })
        .catch(error => {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        });
});

// Route for projects with optional sector query
app.get('/solutions/projects', (req, res) => {
    const sector = req.query.sector;
    if (sector) {
        projectData.getProjectsBySector(sector)
            .then(sectors => {
                res.send(sectors);
            })
            .catch(error => {
                res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
            });
    } else {
        projectData.getAllProjects()
            .then(projects => {
                res.send(projects);
            })
            .catch(error => {
                res.status(500).send({ error: "Error retrieving all projects" });
            });
    }
});

// 404 handler for all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Export the app for Vercel
module.exports = app;
