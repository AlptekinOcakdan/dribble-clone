import {redirect} from "next/navigation";
import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import {getCurrentUser} from "@/lib/session";
import {getProjectDetails} from "@/lib/actions";
import {ProjectInterface} from "@/common.types";

const EditProject = async (props: { params: Promise<{ id: string }> }) => {
    const {id} = await props.params;
    const session = await getCurrentUser();
    if (!session?.user) redirect('/')

    const result = await getProjectDetails(id) as { project?: ProjectInterface };

    if (!result?.project) return (
        <p className="no-result-text">Failed to fetch project info</p>
    )

    return (
        <Modal>
            <h3 className="modal-head-text">Edit Project</h3>
            <ProjectForm type="edit" session={session} project={result?.project}/>
        </Modal>
    );
};

export default EditProject;