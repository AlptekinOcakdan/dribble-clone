import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";

const ProjectActions = ({projectId}: { projectId: string }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
        <>
            <Link href={`/edit-project/${projectId}`} className="flexCenter edit-action_btn">
                <Image src="/pencile.svg" width={15} height={15} alt="edit"/>
            </Link>

        </>
    );
};

export default ProjectActions;