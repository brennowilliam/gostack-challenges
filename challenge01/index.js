const express = require("express");

const server = express();

server.use(express.json());

// Data
const projects = [];
let requestsCouter = 0;

// Middleware
function hasIdAndTitle(req, res, next) {
  let errors = [];
  if (!req.body.id) {
    errors.push("id is required");
  }

  if (!req.body.title) {
    errors.push("title is required");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  return next();
}

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logger(req, res, next) {
  requestsCouter += 1;
  console.log(`Number of Requests: ${requestsCouter}`);
  return next();
}

server.use(logger);

// Routes
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", hasIdAndTitle, (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

// Start server
server.listen(3000);
