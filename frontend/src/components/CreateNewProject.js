import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewProject = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

    const submitProject = async (e) => {
        e.preventDefault(); // Prevent page reload

        const projectData = { name, description };

        try {
            const response = await fetch("http://localhost:3000/projects", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                alert("Project Created Successfully!");
                setName(''); // Clear input fields
                setDescription('');

                // Navigate to CreateNewTask page
                navigate("/CreateNewTask"); 
            } else {
                alert("Failed to create project");
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div>
            <h3>Create New Project</h3>
            <form onSubmit={submitProject}>
                <input
                    type='text'
                    value={name}
                    placeholder='Enter project name'
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type='text'
                    value={description}
                    placeholder='Enter description'
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default CreateNewProject;
