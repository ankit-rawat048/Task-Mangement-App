import React from 'react';
import '../styles/csspages/HowTo.css';
import Navbar from '../components/Navbar';

const HowTo = () => {
  return (
    <>
      <Navbar />
      <div className="how-to-container" role="main" aria-label="How to use instructions">
        <h1>How to Use This Application</h1>

        <section className="section">
          <h2>Introduction</h2>
          <p>
            Welcome to our project management application! This app allows you to create, manage, and track tasks and projects. Below are some instructions to help you get started.
          </p>
        </section>

        <section className="section">
          <h2>Features</h2>
          <ul>
            <li><strong>Task Creation:</strong> Easily create tasks and subtasks to break down your projects into manageable pieces.</li>
            <li><strong>Task Editing:</strong> Edit the details of any task or subtask, including title, description, due date, and priority.</li>
            <li><strong>Task Deletion:</strong> Remove tasks that are no longer needed from your projects.</li>
            <li><strong>Notes:</strong> Add notes to each task for important information and updates.</li>
            <li><strong>Task Assignment:</strong> Assign tasks to team members and track their progress.</li>
            <li><strong>Due Dates:</strong> Set deadlines for tasks to help you stay on track.</li>
            <li><strong>Task Status:</strong> Change the status of tasks (e.g., Pending, In Progress, Completed) to track their progress.</li>
          </ul>
        </section>

        <section className="section">
          <h2>How to Create a New Task</h2>
          <ol>
            <li>Click the <strong>➕ Add Task</strong> button located on the project details page.</li>
            <li>A form will appear allowing you to enter the task title, description, due date, and priority level.</li>
            <li>After filling out the task details, click <strong>Save</strong> to create the task.</li>
          </ol>
        </section>

        <section className="section">
          <h2>How to Edit a Task</h2>
          <ol>
            <li>Click the <strong>Edit</strong> button next to the task you want to modify.</li>
            <li>Edit the details of the task (title, description, due date, etc.).</li>
            <li>Click <strong>Save</strong> to update the task with your changes.</li>
          </ol>
        </section>

        <section className="section">
          <h2>How to Delete a Task</h2>
          <ol>
            <li>Click the <strong>Delete</strong> button next to the task you want to remove.</li>
            <li>You will be asked to confirm the deletion. Click <strong>Confirm</strong> to permanently delete the task.</li>
          </ol>
        </section>

        <section className="section">
          <h2>How to Add a Subtask</h2>
          <ol>
            <li>Click the <strong>➕ Add Subtask</strong> button below a task to create a subtask.</li>
            <li>Enter the subtask title and description, then click <strong>Save Subtask</strong>.</li>
            <li>The new subtask will appear under the parent task, and you can edit or delete it as needed.</li>
          </ol>
        </section>

        <section className="section">
          <h2>How to View Task Details</h2>
          <p>
            Simply click on any task title to view its detailed information, including the task description, notes, and status. You can also update or delete the task from this view.
          </p>
        </section>

        <section className="section">
          <h2>How to Assign Tasks</h2>
          <ol>
            <li>While editing a task, use the <strong>Assign To</strong> field to select the user to assign the task to.</li>
            <li>Click <strong>Save</strong> to save the assignment. The assigned user will be notified about the task.</li>
          </ol>
        </section>

        <section className="section">
          <h2>How to Track Progress</h2>
          <p>
            Tasks include a progress bar that you can update to reflect the current completion percentage. You can set the progress when editing a task.
          </p>
        </section>

        <section className="section">
          <h2>How to Set Due Dates</h2>
          <ol>
            <li>While creating or editing a task, use the <strong>Due Date</strong> field to set the deadline.</li>
            <li>Tasks will appear in the project with their respective due dates. You can sort tasks by due date to stay organized.</li>
          </ol>
        </section>

        <footer className="footer">
          <p>Thank you for using our project management app! If you have any questions, feel free to contact support.</p>
        </footer>
      </div>
    </>
  );
};

export default HowTo;
