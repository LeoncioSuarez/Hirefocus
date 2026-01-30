export const contactsData = [
    {
        id: 1,
        name: "admin",
        role: "Main Administrator",
        company: "Hirefocus",
        email: "admin@hirefocus.com",
        phone: "+1 555-0101",
        avatar: "https://i.pravatar.cc/150?u=1",
        status: "Active"
    },
    {
        id: 2,
        name: "admin1",
        role: "Admin Assistant",
        company: "Hirefocus",
        email: "admin1@hirefocus.com",
        phone: "+1 555-0102",
        avatar: "https://i.pravatar.cc/150?u=2",
        status: "Busy"
    },
    {
        id: 3,
        name: "admin2",
        role: "Recruiter Admin",
        company: "Hirefocus",
        email: "admin2@hirefocus.com",
        phone: "+1 555-0103",
        avatar: "https://i.pravatar.cc/150?u=3",
        status: "Offline"
    }
];

export const projectsData = [
    {
        id: 1,
        name: "Senior .NET Developer",
        company: "Flying Free",
        activity: "20.10.2025 17:56",
        stats: 18,
        assignedTo: [1, 3] // IDs of contacts assigned
    },
    {
        id: 2,
        name: "Project Manager",
        company: "Colorful Investments",
        activity: "20.10.2025 17:54",
        stats: 7,
        assignedTo: [2, 4] // IDs of contacts assigned
    },
    {
        id: 3,
        name: "UI Refactor",
        company: "TechFlow",
        activity: "21.10.2025 09:30",
        stats: 5,
        assignedTo: [5]
    }
];

export const userActivities = [
    { id: 1, contactId: 1, action: "updated the testing protocols" },
    { id: 2, contactId: 2, action: "submitted a new report" },
    { id: 3, contactId: 2, action: "commented on the project" },
    { id: 4, contactId: 3, action: "pushed code to production" }
];
