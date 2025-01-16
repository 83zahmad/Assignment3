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
require('dotenv').config();
require('pg');
const Sequelize = require('sequelize'); 

let sequelize = new Sequelize(process.env.PGDATABASE,process.env.PGUSER,process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });


const Sector = sequelize.define("Sector",{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sector_name: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false,
})

const Project = sequelize.define("Project", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    impact: Sequelize.TEXT,
    original_source_url: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false,
})

Project.belongsTo(Sector, { foreignKey: 'sector_id' });


function initialize(){
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(()=>{
            resolve()
        }).catch(err=>{
            reject(err);
        })
    })
};

function getAllProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            include: [Sector],
            attributes: [
                "id",
                "title",
                "feature_img_url",
                "summary_short",
                "intro_short",
                "impact",
                "original_source_url"
            ],
            order: [["id", "ASC"]]
        })
            .then(projects => {
                if (projects.length > 0) {
                    resolve(projects);
                } else {
                    reject("No projects found in the database.");
                }
            })
            .catch(err => {
                reject(`Error retrieving projects: ${err}`);
            });
    });
}


function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        Project.findOne({
            include: [Sector], 
            where: { id: projectId }
        })
        .then(project => {
            if (project) {
                resolve(project);
            } else {
                reject(new Error(`Project with ID ${projectId} not found.`));
            }
        })
        .catch(err => reject(new Error(`Error fetching project: ${err.message}`)));
    });
}




function getProjectsBySector(sector) {
    return Project.findAll({
        include: [Sector],
        where: {
            '$Sector.sector_name$': {
                [Sequelize.Op.iLike]: `%${sector}%`
            }
        }
    }).then(data => {
        if (data.length > 0) {
            return data; 
        }
        else {
            throw new Error("Unable to find requested projects");
        }
    }).catch(err => {
        throw err;
    });
}

function addProject(projectData) {
    return new Promise((resolve, reject) => {
        Project.create({
            title: projectData.title,
            feature_image_url: projectData.feature_img_url,
            sector_id: projectData.sector_id,
            intro_short: projectData.intro_short,
            summary_short: projectData.summary_short,
            impact: projectData.impact,
            original_source_url: projectData.original_source_url
        })
        .then(() => resolve())
        .catch(err => {
            const errorMessage = err.errors && err.errors[0] ? err.errors[0].message : "Error adding project";
            reject(errorMessage);
        });
    });
} 


async function getAllSectors() {
    try {
        const sectors = await Sector.findAll();
        if (!sectors || sectors.length === 0) {
            throw new Error("No sectors found in the database.");
        }
        return sectors;
    } catch (err) {
        throw new Error(`Unable to fetch sectors: ${err.message || err}`);
    }
}



function editProject(id, projectData) {
    return new Promise((resolve, reject) => {
        Project.update(
            {
                title: projectData.title,
                feature_img_url: projectData.feature_img_url,
                sector_id: projectData.sector_id,
                intro_short: projectData.intro_short,
                summary_short: projectData.summary_short,
                impact: projectData.impact,
                original_source_url: projectData.original_source_url
            },
            {
                where: { id: id }
            }
        )
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                reject("No project found with the specified ID.");
            } else {
                resolve();
            }
        })
        .catch(err => {
            const errorMessage = err.errors && err.errors[0] ? err.errors[0].message : "Error updating project";
            reject(errorMessage);
        });
    });
}




    module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector, getAllSectors, addProject, editProject }

