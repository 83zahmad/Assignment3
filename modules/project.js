<!-- /********************************************************************************
* BTI325 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 2nd 2024
*
********************************************************************************/ -->
const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projectData.forEach(project => {
                const sectorObj = sectorData.find(sector => sector.id === project.sector_id);
                if (sectorObj) {
                    project.sector = sectorObj.sector_name;
                }
                projects.push(project);
            });
            resolve();
        } catch (error) {
            reject("Error Initializing project Data" + error);
        }
    })
}

function getAllProjects() {
    return new Promise((resolve) => {
        resolve(projects);
    });
}


function getProjectById(projectID) {
    return new Promise((resolve, reject) => {
        const project = projects.find(p => p.id === projectID);
        if (project) {
            resolve(project);
        } else {
            reject(`Project with ID ${projectID} not Found`);
        }
    })
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const sectors = projects.filter(p => p.sector.toLowerCase().includes(sector.toLowerCase()));
        if (sectors.length > 0) {
            resolve(sectors);
        } else {
            reject(`Project with ID ${sector} not Found`);
        }
    })
}


    module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector }