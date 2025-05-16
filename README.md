🔐 Auth Routes
URL Prefix: /api/auth


Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Log in and receive JWT token

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Y5ZmZlNmI0N2ZlYjU2NDU0ZDA2MzQiLCJpYXQiOjE3NDUzMDM1MjQsImV4cCI6MTc0NTMwNzEyNH0.JSNxKGg1AE8incQMSqVvyB32PFlDj--WIsQv9T5R0-k",
    "userId": "67f9ffe6b47feb56454d0634"
}


POST	/api/auth/logout	Log out and blacklist token
GET	/api/auth/me	Get current logged-in user info
📁 Project Routes
URL Prefix: /api/projects
(All these require authentication)


Method	Endpoint	Description
POST	http://localhost:5000/api/projects	Create a new project
GET	/api/projects	Get all projects of logged-in user
GET	http://localhost:5000/api/projects/:id	Get one project (with tasks & subtasks)
PUT	/api/projects/:id	Update title and description of a project
DELETE	/api/projects/:id	Delete a project
GET	/api/projects/:id/details	🔥 Get full detailed data for a project
✅ Task Routes
URL Prefix: /api/tasks
(Require authentication)


Method	Endpoint	Description
POST	/api/tasks	Create a new task
(
  http://localhost:5000/api/tasks

  {
  "title": "Task 1",
  "description": "This is a task assigned to a project",
  "status": "pending",
  "deadline": "2025-05-01",
  "projectId": "68073d943fb6036b7fbab957",
  "priority": "High",
  "assignedTo": "67f9ffe6b47feb56454d0634",  //userid
  "tags": ["important"]
}

)
get http://localhost:5000/api/tasks/:id
to get a task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task
🔄 Subtask Routes
URL Prefix: /api/subtasks
(Require authentication)


Method	Endpoint	Description
POST	/api/subtasks	Create a new subtask
PUT	/api/subtasks/:id	Update a subtask
DELETE	/api/subtasks/:id	Delete a subtask





<!-- updated -->

Create image POST	http://localhost:5000/api/projects	Create a new project
GET	http://localhost:5000/api/projects/:id	Get one project (with tasks & subtasks)
PUT	http://localhost:5000/api/projects/:id	Update title and description of a project
DELETE	http://localhost:5000/api/projects/:id	Delete a project

POST	/api/tasks	Create a new task
(
  http://localhost:5000/api/tasks

  {
  {
  "title": "Task 1",
  "description": "This is a task assigned to a project",
  "status": "pending",
  "deadline": "2025-05-01",
  "projectId": "68090ae8c87dbc6c5d0cf558",
  "priority": "High",
  "tags": ["important"]
}

get http://localhost:5000/api/tasks/:id
to get a task
put http://localhost:5000/api/tasks/:id
{
  "title": "Task new ",
  "description": "This is a task assigned to a project",
  "status": "in progress",
  "deadline": "2025-06-01",
  "projectId": "68090ae8c87dbc6c5d0cf558",
  "priority": "High",
  "tags": ["important"]
}
response:
{
    "message": "Task updated successfully",
    "task": {
        "_id": "6809e5c3556dd295511a9f27",
        "title": "Task new",
        "description": "This is a task assigned to a project",
        "status": "in progress",
        "deadline": "2025-06-01T00:00:00.000Z",
        "priority": "High",
        "assignedTo": null,
        "project": "68090ae8c87dbc6c5d0cf558",
        "subtasks": [],
        "dependsOn": [],
        "progress": 0,
        "tags": [
            "important"
        ],
        "parentTask": null,
        "createdAt": "2025-04-24T07:18:27.369Z",
        "updatedAt": "2025-04-24T07:27:02.480Z",
        "__v": 0
    }
}
delete http://localhost:5000/api/tasks/:id


post http://localhost:5000/api/tasks  to create a subtask

{
  "title": "Subtask tmc",
  "description": "Details of the subtask",
  "deadline": "2025-05-01",
  "status": "pending",
  "projectId": "6809e99e556dd295511a9f39",
  "parentTaskId": "6809e9ce556dd295511a9f3f",
  "tags": ["backend", "api"]
}


put http://localhost:5000/api/tasks/:id  to update a subtask
{
  "title": "Subtask tmc",
  "description": "Details of the subtask",
  "deadline": "2025-05-01",
  "status": "pending",
  "projectId": "6809e99e556dd295511a9f39",
  "parentTaskId": "6809e9ce556dd295511a9f3f",
  "tags": ["backend", "api"]
}

delete http://localhost:5000/api/tasks/:id  to delete a sub tasks
get http://localhost:5000/api/tasks/:id to get subtask details







 + task-name       details-icon  add-note-icon update-task/delete-task +add-subtask

       subtask-name       details-icon  add-note-icon update-task/delete-task 
       subtask-name       details-icon  add-note-icon update-task/delete-task 
       subtask-name       details-icon  add-note-icon update-task/delete-task 
       subtask-name       details-icon  add-note-icon update-task/delete-task 