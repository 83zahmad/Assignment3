/********************************************************************************
* BTI325 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: December 8th 2024
*
********************************************************************************/

const projectData = require("./modules/project");
const express = require('express');
const app = express();
const path = require('path');
const authData = require('./modules/auth-service.js')
const clientSessions = require("client-sessions");


app.use(express.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;

app.use(clientSessions({
    cookieName: "session", 
    secret: "Zcanucks83", 
    duration: 2 * 60 * 60 * 1000, 
    activeDuration: 30 * 60 * 1000 
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/login', (req, res) => {
    res.render('login', { errorMessage: "", userName: "" });
});

app.get('/register', (req, res) => {
    res.render('register', { errorMessage: "", successMessage: "", userName: "" });
});


app.post('/register', (req, res) => {
    authData.registerUser(req.body)
        .then(() => {
            res.render('register', {
                errorMessage: "",
                successMessage: "User created",
                userName: ""
            });
        })
        .catch(err => {
            res.render('register', {
                errorMessage: err,
                successMessage: "",
                userName: req.body.userName
            });
        });
});

app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent'); 

    authData.checkUser(req.body)
        .then(user => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/solutions/projects');
        })
        .catch(err => {
            res.render('login', {
                errorMessage: err,
                userName: req.body.userName
            });
        });
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory', { loginHistory: req.session.user.loginHistory });
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
                console.log("Projects error:");
                res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
            });
    }
});


app.get('/solutions/addProject', ensureLogin, (req, res) => {
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

app.get('/solutions/editProject/:id', ensureLogin, async (req, res) => {
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


app.post('/solutions/editProject', ensureLogin, (req, res) => {
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

app.get('/solutions/deleteProject/:id', ensureLogin, (req, res) => {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
        return res.status(400).render('404', { message: `Invalid project ID: ${req.params.id}` });
    }

    projectData.deleteProjectById(projectId)
        .then(() => {
            res.redirect('/solutions/projects');
        })
        .catch(error => {
            console.error("Error deleting project:", error);
            res.status(500).render('500', { message: `Unable to delete project: ${error}` });
        });
});


app.use((req, res) => {
    res.status(404).render('404');
});

projectData.initialize()
    .then(authData.initialize)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`);
        });
    })
    .catch(error => {
        console.error("Unable to start server:", error);
    });




module.exports = app;
