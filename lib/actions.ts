"use server";

// In-memory mock of the old Grafbase backend. Same function names and response shapes as the GraphQL queries,
// so pages stay unchanged. shortcut: data resets on server restart, swap for a real DB if this needs to persist.
import {ProjectForm} from "@/common.types";

type MockUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    description: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
};
type MockProject = ProjectForm & { id: string; createdById: string };

const PAGE_SIZE = 8;

const avatar = (seed: string) => `https://i.pravatar.cc/150?u=${seed}`;
const shot = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const seedUsers: MockUser[] = [
    {id: "u1", name: "Demo User", email: "demo@flexibble.dev", avatarUrl: avatar("demo"), description: "Full-stack developer trying out Flexibble.", githubUrl: "https://github.com", linkedinUrl: "https://linkedin.com"},
    {id: "u2", name: "Ayşe Yılmaz", email: "ayse@flexibble.dev", avatarUrl: avatar("ayse"), description: "Frontend developer who loves clean UI.", githubUrl: null, linkedinUrl: null},
    {id: "u3", name: "Mehmet Kaya", email: "mehmet@flexibble.dev", avatarUrl: avatar("mehmet"), description: "Backend & DevOps.", githubUrl: null, linkedinUrl: null},
    {id: "u4", name: "Elif Demir", email: "elif@flexibble.dev", avatarUrl: avatar("elif"), description: "Mobile and game developer.", githubUrl: null, linkedinUrl: null},
];

const projectSeeds: [string, string, string][] = [
    ["Portfolio Website", "Frontend", "u1"], ["Dashboard UI Kit", "Frontend", "u2"], ["Landing Page Builder", "Frontend", "u2"],
    ["Weather App", "Frontend", "u1"], ["Movie Explorer", "Frontend", "u4"], ["Crypto Tracker", "Frontend", "u3"],
    ["Recipe Finder", "Frontend", "u2"], ["Kanban Board", "Frontend", "u1"], ["Travel Blog", "Frontend", "u4"],
    ["Chat Interface", "Frontend", "u3"], ["REST API Starter", "Backend", "u3"], ["Auth Service", "Backend", "u1"],
    ["Social Network", "Full-Stack", "u1"], ["E-commerce Store", "E-commerce", "u2"], ["Fitness Tracker", "Mobile", "u4"],
    ["Pixel Platformer", "Game Dev", "u4"], ["CI/CD Pipeline", "DevOps", "u3"], ["Sales Analytics", "Data Science", "u2"],
];

const seedProjects: MockProject[] = projectSeeds.map(([title, category, createdById], i) => ({
    id: `p${i + 1}`,
    title,
    category,
    createdById,
    description: `${title} is a sample ${category.toLowerCase()} project shown with mock data.`,
    image: shot(`flexibble-${i + 1}`),
    liveSiteUrl: "https://example.com",
    githubUrl: "https://github.com",
}));

// Kept on globalThis so dev hot reloads don't wipe it.
const db = ((globalThis as any).__flexibbleDb ??= {
    users: structuredClone(seedUsers),
    projects: structuredClone(seedProjects),
    nextId: seedProjects.length + 1,
}) as { users: MockUser[]; projects: MockProject[]; nextId: number };

const toNode = (p: MockProject) => {
    const {createdById, ...rest} = p;
    const u = db.users.find((user) => user.id === createdById)!;
    return {...rest, createdBy: {id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl}};
};

export const fetchToken = async () => ({token: "mock-token"});

export const fetchAllProjects = async (category?: string | null, endcursor?: string | null) => {
    const all = db.projects.filter((p) => !category || p.category === category);
    const start = endcursor ? all.findIndex((p) => p.id === endcursor) + 1 : 0;
    const page = all.slice(start, start + PAGE_SIZE);

    return {
        projectSearch: {
            edges: page.map((p) => ({node: toNode(p)})),
            pageInfo: {
                hasPreviousPage: start > 0,
                hasNextPage: start + PAGE_SIZE < all.length,
                startCursor: page[0]?.id ?? "",
                endCursor: page[page.length - 1]?.id ?? "",
            },
        },
    };
};

export const createNewProject = async (form: ProjectForm, creatorId: string, _token: string) => {
    const project = {...form, id: `p${db.nextId++}`, createdById: creatorId};
    db.projects.unshift(project);
    return {projectCreate: {project: toNode(project)}};
};

export const updateProject = async (form: ProjectForm, projectId: string, _token: string) => {
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    Object.assign(project, form);
    return {projectUpdate: {project: toNode(project)}};
};

export const deleteProject = async (id: string, _token: string) => {
    db.projects = db.projects.filter((p) => p.id !== id);
    return {projectDelete: {deletedId: id}};
};

export const getProjectDetails = async (id: string) => {
    const project = db.projects.find((p) => p.id === id);
    return {project: project ? toNode(project) : null};
};

export const createUser = async (name: string, email: string, avatarUrl: string) => {
    const user = {id: `u${Date.now()}`, name, email, avatarUrl: avatarUrl || avatar(email), description: null, githubUrl: null, linkedinUrl: null};
    db.users.push(user);
    return {userCreate: {user}};
};

export const getUserProjects = async (id: string, last = 4) => {
    const user = db.users.find((u) => u.id === id);
    if (!user) return {user: null};

    const projects = db.projects.filter((p) => p.createdById === id).slice(0, last);
    return {user: {...user, projects: {edges: projects.map((p) => ({node: toNode(p)}))}}};
};

export const getUser = async (email: string) => ({user: db.users.find((u) => u.email === email) ?? null});
