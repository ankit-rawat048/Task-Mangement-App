# task-mangenet-app
#task app
### **📌 API Testing Guide for Users, Projects, Tasks, and Subtasks (Using Postman)**  

---

## **🚀 1️⃣ User API**
### **✅ Create User**
- **URL:** `POST http://localhost:5000/api/users`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

### **✅ Delete User**
- **URL:** `DELETE http://localhost:5000/api/users/{user_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Response:**
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

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
- **Response:**
  ```json
  [
    {
      "_id": "project_id",
      "name": "My Project",
      "description": "This is a sample project"
    }
  ]
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

---

### **✅ Delete a Project**
- **URL:** `DELETE http://localhost:5000/api/projects/{project_id}`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token_here
  ```
- **Response:**
  ```json
  {
    "message": "Project deleted successfully"
  }
  ```

---

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