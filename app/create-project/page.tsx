import React from 'react';
import ProjectForm from "@/components/ProjectForm";
import Modal from "@/components/Modal";

const CreateProject = () => {
    return (
        <Modal>
            <h3 className="modal-head-text">Create a New Project</h3>
            <ProjectForm/>
        </Modal>
    );
};

export default CreateProject;