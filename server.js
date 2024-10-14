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
const express = require('express')
const app = express()
const port = 3000
require('pg');
const Sequelize = require('sequelize');

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.get('/css/main.css', (req,res) => {
    res.sendFile(__dirname, '/public/css/main.css');
})


projectData.initialize().then(() => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
      })
})

app.get('/', (req,res) => {
    res.sendFile(__dirname, + '/views' + '/home.html');
})

app.get('/about', (req,res) => {
    res.sendFile(__dirname, + '/views' + '/about.html');
})

app.get('/solutions/projects/:id', (req,res) => {
    console.log(req.query.sector);
    const projectID = parseInt(req.params.id);
    projectData.getProjectById(projectID)
        .then(project => {
            res.send(project);
        })
        .catch (error => {
            res.status(404).sendFile(__dirname, + '/views' + '/404.html');
        });
})

app.get('/solutions/projects',(req,res) => {
    const sector = req.query.sector;
    if (sector) {
    projectData.getProjectsBySector(sector)
        .then(sectors => {
            res.send(sectors);
        })
        .catch (error => {
            res.status(404).sendFile(__dirname, + '/views' + '/404.html');
        });
    } else {
        res.send(projectData.getAllProjects());
    }
})

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname, + '/views' + '/404.html');
  });
