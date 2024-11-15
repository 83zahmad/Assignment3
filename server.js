/********************************************************************************
* BTI325 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 2nd 2024
*
********************************************************************************/

const projectData = require("./modules/project");
const express = require('express');
const app = express();
const path = require('path');

// Set views and static files directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;



// Route for homepage
app.get('/', (req, res) => {
    res.render('home');
});

// Route for about page
app.get('/about', (req, res) => {
    res.render('about');
});

// Route for project by ID
app.get('/solutions/projects/:id', (req, res) => {
    const projectID = parseInt(req.params.id);
    projectData.getProjectById(projectID)
        .then(project => {
            res.render("project", {project: project});
        })
        .catch(error => {
            res.status(404).render("404", {message: "I'm sorry, we're unable to find the sector that you were looking for"});
        });
});

// Route for projects with optional sector query
app.get('/solutions/projects', (req, res) => {
    const sector = req.query.sector;
    if (sector) {
        projectData.getProjectsBySector(sector)
            .then(filteredProjects => {
                res.render("projects", {projects: filteredProjects});
            })
            .catch(error => {
                res.status(404).render("404", {message: `No projects found for sector: ${sector}`});
            });
    } else {
        projectData.getAllProjects()
            .then(projects => {
                res.render("projects", {projects: projects});
            })
            .catch(error => {
                res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
            });
    }
});


// 404 handler for all other routes
app.use((req, res) => {
    res.status(404).render('404');
});

// Initialize data
projectData.initialize().then(() => {
    console.log("Project data initialized successfully.");
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`)
    });

}).catch((error) => {
    console.log("Error initializing project data:", error);
});




// Export the app for Vercel
module.exports = app;
