/********************************************************************************
<<<<<<< HEAD
* BTI325 – Assignment 05
=======
* BTI325 – Assignment 04
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
<<<<<<< HEAD
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 15th 2024
=======
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 2nd 2024
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
*
********************************************************************************/

const projectData = require("./modules/project");
const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
<<<<<<< HEAD

const HTTP_PORT = process.env.PORT || 8080;
=======

const HTTP_PORT = process.env.PORT || 8080;

>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf


app.get('/', (req, res) => {
    res.render('home');
});


app.get('/about', (req, res) => {
    res.render('about');
});


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
<<<<<<< HEAD
                console.log("Projects error:");
=======
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
                res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
            });
    }
});


<<<<<<< HEAD
app.get('/solutions/addProject', (req, res) => {
    projectData.getAllSectors()
        .then(sectors => {
            res.render('addProject', { sectors: sectors });
        })
        .catch(error => {
            res.status(500).render('500', { message: `Unable to load sectors: ${error}` });
        });
});

app.post('/solutions/addProject', (req, res) => {
    projectData.addProject(req.body)
        .then(() => {
            res.redirect('/solutions/projects');
        })
        .catch(error => {
            res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
});

app.get('/solutions/editProject/:id', async (req, res) => {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
        return res.status(400).render('404', { message: `Invalid project ID: ${req.params.id}` });
    }

    try {
        const [project, sectors] = await Promise.all([
            projectData.getProjectById(projectId),
            projectData.getAllSectors()
        ]);

        if (!project) {
            console.error(`Project with ID ${projectId} not found.`);
            return res.status(404).render('404', { message: `Project with ID ${projectId} not found.` });
        }

        res.render('editProject', { project, sectors });

    } catch (err) {
        console.error("Error fetching project or sectors:", err);
        res.status(500).render('500', { message: `Error loading project: ${err.message}` });
    }
});


app.post('/solutions/editProject', (req, res) => {
    console.log("Edit Request Data:", req.body);
    projectData.editProject(req.body.id, req.body)
        .then(() => {
            res.redirect('/solutions/projects');
        })
        .catch(err => {
            console.error("Error updating project:", err);
            res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});


app.use((req, res) => {
    res.status(404).render('404');
});

=======
// 404 handler for all other routes
app.use((req, res) => {
    res.status(404).render('404');
});

// Initialize data
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
projectData.initialize().then(() => {
    console.log("Project data initialized successfully.");
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`)
    });

}).catch((error) => {
    console.log("Error initializing project data:", error);
});


<<<<<<< HEAD
=======


// Export the app for Vercel
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
module.exports = app;
