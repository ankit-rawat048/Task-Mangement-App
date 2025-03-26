# task-mangenet-app
#task app
### **📌 API Testing Guide for Users, Projects, Tasks, and Subtasks (Using Postman)**  

---

## **🚀 1️⃣ User API**
### **✅ Create User**
- **URL:** `POST http://localhost:5000/api/auth/signup`
- **Body (JSON):**
{
    "name": "John Doe",
    "username": "johndoe12",
    "email": "johndoe@example.com",
    "password": "password123"
}

  ```
  ```

### **✅ Login User**
- **URL:** `POST http://localhost:5000/api/auth/login`
- **Body (JSON):**
{
    "username": "johndoe123",
    "password": "password123"
}
or

{
    "email": "johndoe@example.com",
    "password": "password123"
}

  ```
---

  ```
### **✅ Delete User**
- **URL:** `DELETE http://localhost:5000/api/auth/delete`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
  json:
  delete by :
  {
    "email": "johndoe@example.com"
}
or
{
    "userId": "65efc5b12a3b4d001fb3b4a5"
}

---

## **🛠️ 2️⃣ Project API**
### **✅ Create a Project**
- **URL:** `POST http://localhost:5000/api/projects`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Body (JSON):**
  ```json
  {
    "name": "My Project",
    "description": "This is a sample project"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Project created successfully",
    "project": {
      "_id": "project_id",
      "name": "My Project",
      "description": "This is a sample project"
    }
  }
  ```

---

### **✅ Get All Projects**
- **URL:** `GET http://localhost:5000/api/projects`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
---
---

### **✅ Get single Project**
- **URL:** `GET http://localhost:5000/api/projects/:id`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
---

---

### **✅ Delete a Projects**
- **URL:** `GET http://localhost:5000/api/projects/:id`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
---

### **✅ Update a Project**
- **URL:** `PUT http://localhost:5000/api/projects/{project_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Body (JSON):**
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated Description"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Project updated successfully",
    "project": {
      "_id": "project_id",
      "name": "Updated Project Name",
      "description": "Updated Description"
    }
  }
  ```


## **📋 3️⃣ Task API**
### **✅ Add a Task to a Project**
- **URL:** `POST http://localhost:5000/api/projects/{project_id}/tasks`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Body (JSON):**
  ```json
  {
    "title": "Task 1",
    "completed": false
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task added successfully",
    "task": {
      "_id": "task_id",
      "title": "Task 1",
      "completed": false
    }
  }
  ```

---

### **✅ Get Tasks for a Project**
- **URL:** `GET http://localhost:5000/api/projects/{project_id}/tasks`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Response:**
  ```json
  [
    {
      "_id": "task_id",
      "title": "Task 1",
      "completed": false
    }
  ]
  ```

---

### **✅ Update a Task**
- **URL:** `PUT http://localhost:5000/api/projects/{project_id}/tasks/{task_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Body (JSON):**
  ```json
  {
    "title": "Updated Task",
    "completed": true
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "_id": "task_id",
      "title": "Updated Task",
      "completed": true
    }
  }
  ```

---

### **✅ Delete a Task**
- **URL:** `DELETE http://localhost:5000/api/projects/{project_id}/tasks/{task_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Response:**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

## **📌 4️⃣ Subtask API**
### **✅ Add a Subtask to a Task**
- **URL:** `POST http://localhost:5000/api/projects/{project_id}/tasks/{task_id}/subtasks`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Body (JSON):**
  ```json
  {
    "title": "Subtask 1",
    "completed": false
  }
  ```
- **Response:**
  ```json
  {
    "message": "Subtask added successfully",
    "subtask": {
      "_id": "subtask_id",
      "title": "Subtask 1",
      "completed": false
    }
  }
  ```

---

### **✅ Get Subtasks for a Task**
- **URL:** `GET http://localhost:5000/api/projects/{project_id}/tasks/{task_id}/subtasks`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Response:**
  ```json
  [
    {
      "_id": "subtask_id",
      "title": "Subtask 1",
      "completed": false
    }
  ]
  ```

---

### **✅ Update a Subtask**
- **URL:** `PUT http://localhost:5000/api/projects/{project_id}/tasks/{task_id}/subtasks/{subtask_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Body (JSON):**
  ```json
  {
    "title": "Updated Subtask",
    "completed": true
  }
  ```
- **Response:**
  ```json
  {
    "message": "Subtask updated successfully",
    "subtask": {
      "_id": "subtask_id",
      "title": "Updated Subtask",
      "completed": true
    }
  }
  ```

---

### **✅ Delete a Subtask**
- **URL:** `DELETE http://localhost:5000/api/projects/{project_id}/tasks/{task_id}/subtasks/{subtask_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Response:**
  ```json
  {
    "message": "Subtask deleted successfully"
  }
  ```

---

## **🔧 Steps to Test in Postman**
1. **Start your backend**:  
   ```sh
   npm run dev
   ```
2. **Use Postman** to send requests.  
3. **For protected routes**, add `Authorization: Bearer YOUR_TOKEN` in **Headers**.  
4. **Check console logs** if anything goes wrong.  

---

🚀 **Now you can easily test your backend with Postman!** Let me know if you need any modifications! 🚀