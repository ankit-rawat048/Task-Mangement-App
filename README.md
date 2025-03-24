# task-mangenet-app
#task app

Testing the Task Management App in Postman 🚀
To test your backend API in Postman, follow these steps:

🛠 1. Start Your Backend Server
First, start the backend server:

bash
Copy
Edit
node server.js
or, if you are using nodemon:

bash
Copy
Edit
nodemon server.js
By default, your backend will run at:
http://localhost:5000

📌 2. Create a New User (Signup)
Endpoint:
URL: POST http://localhost:5000/api/auth/signup

Headers: Content-Type: application/json

Body (JSON):

json
Copy
Edit
{
  "name": "Ankit Rawat",
  "email": "ankit@example.com",
  "password": "password123"
}
✅ Expected Response:
json
Copy
Edit
{
  "message": "User created successfully!"
}
📌 3. Login as a User
Endpoint:
URL: POST http://localhost:5000/api/auth/login

Headers: Content-Type: application/json

Body (JSON):

json
Copy
Edit
{
  "email": "ankit@example.com",
  "password": "password123"
}
✅ Expected Response:
json
Copy
Edit
{
  "token": "eyJhbGciOiJIUzI1...",
  "userId": "65f2f3e45bf2..."
}
NOTE: Copy the token from the response. You will use this token for authorization in future API calls.

📌 4. Create a New Project
Endpoint:
URL: POST http://localhost:5000/api/projects

Headers:

Content-Type: application/json

Authorization: Bearer <your_token> (Replace <your_token> with the token you got from login)

Body (JSON):

json
Copy
Edit
{
  "title": "My Portfolio Website",
  "description": "A personal website to showcase my projects."
}
✅ Expected Response:
json
Copy
Edit
{
  "_id": "65f3a2b12e4...",
  "title": "My Portfolio Website",
  "description": "A personal website to showcase my projects.",
  "createdBy": "65f2f3e45bf2...",
  "tasks": []
}
NOTE: Copy the _id of this project. You will use it in the next step.

📌 5. Create a Task Under the Project
Endpoint:
URL: POST http://localhost:5000/api/tasks

Headers:

Content-Type: application/json

Authorization: Bearer <your_token>

Body (JSON):

json
Copy
Edit
{
  "title": "Design Homepage",
  "description": "Create a landing page for the website.",
  "projectId": "65f3a2b12e4..."  // Replace with actual project ID
}
✅ Expected Response:
json
Copy
Edit
{
  "_id": "65f3a3c98a...",
  "title": "Design Homepage",
  "description": "Create a landing page for the website.",
  "status": "pending",
  "deadline": null,
  "project": "65f3a2b12e4...",
  "subtasks": []
}
NOTE: Copy the _id of this task if you want to create subtasks.

📌 6. Create a Subtask Under a Task
Endpoint:
URL: POST http://localhost:5000/api/tasks

Headers:

Content-Type: application/json

Authorization: Bearer <your_token>

Body (JSON):

json
Copy
Edit
{
  "title": "Add CSS Styles",
  "description": "Style the homepage with CSS.",
  "projectId": "65f3a2b12e4...",  // Replace with actual project ID
  "parentTaskId": "65f3a3c98a..." // Replace with actual task ID
}
✅ Expected Response:
json
Copy
Edit
{
  "_id": "65f3a4d21b...",
  "title": "Add CSS Styles",
  "description": "Style the homepage with CSS.",
  "status": "pending",
  "deadline": null,
  "project": "65f3a2b12e4...",
  "subtasks": []
}
📌 7. Fetch User Data with Projects and Tasks
Endpoint:
URL: GET http://localhost:5000/api/user

Headers:

Authorization: Bearer <your_token>

✅ Expected Response:

json
Copy
Edit
{
  "name": "Ankit Rawat",
  "email": "ankit@example.com",
  "projects": [
    {
      "title": "My Portfolio Website",
      "tasks": [
        {
          "title": "Design Homepage",
          "subtasks": [
            {
              "title": "Add CSS Styles"
            }
          ]
        }
      ]
    }
  ]
}
📌 8. Update Task Status
Endpoint:
URL: PUT http://localhost:5000/api/tasks/65f3a3c98a...

Headers:

Content-Type: application/json

Authorization: Bearer <your_token>

Body (JSON):

json
Copy
Edit
{
  "status": "completed"
}
✅ Expected Response:
json
Copy
Edit
{
  "message": "Task updated successfully"
}
📌 9. Delete a Task
Endpoint:
URL: DELETE http://localhost:5000/api/tasks/65f3a3c98a...

Headers:

Authorization: Bearer <your_token>

✅ Expected Response:
json
Copy
Edit
{
  "message": "Task deleted successfully"
}
🎯 Summary of API Endpoints
Action	Method	Endpoint	Headers
Signup	POST	/api/auth/signup	Content-Type: application/json
Login	POST	/api/auth/login	Content-Type: application/json
Create Project	POST	/api/projects	Authorization: Bearer <token>
Create Task	POST	/api/tasks	Authorization: Bearer <token>
Create Subtask	POST	/api/tasks	Authorization: Bearer <token>
Fetch User Data	GET	/api/user	Authorization: Bearer <token>
Update Task	PUT	/api/tasks/:taskId	Authorization: Bearer <token>
Delete Task	DELETE	/api/tasks/:taskId	Authorization: Bearer <token>
