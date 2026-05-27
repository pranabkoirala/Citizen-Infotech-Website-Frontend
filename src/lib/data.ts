// Static fallback data used when API is unavailable
import type { TeamMember, Project, Job } from "./api";
import a1 from "../images/a1.jpg"

export const teamMembers: TeamMember[] = [
  { id: 1, name: "Pranab Koirala", role: "CEO, Co-Founder", order_index: 0 },
  { id: 2, name: "Dipendra Kumar Yadav", role: "MD, Co-Founder", order_index: 1 },
  { id: 3, name: "Ujwal Koirala", role: "Province Director, Koshi", order_index: 2 },
  { id: 4, name: "Muktinath Khanal", role: "Health Systems-Strategy Advisor", order_index: 3 },
  { id: 5, name: "Sushank Pokharel", role: "Head, Development", order_index: 4 },
  { id: 6, name: "Ritesh Nidhi", role: "Sales Head, Madhesh Province", order_index: 5 },
  { id: 7, name: "Dr. Bikash Lamichhane", role: "Health Consultant", order_index: 6 },
  { id: 8, name: "Sagar Subedi", role: "Team Leader", order_index: 7 },
  { id: 9, name: "Narayan Adhikari", role: "Team Leader", order_index: 8 },
  { id: 10, name: "Utsab Dahal", role: "AI Engineer", order_index: 9 },
  { id: 11, name: "Dipendra Khadka", role: "Backend Developer", order_index: 10 },
  { id: 12, name: "Abiral Neupane", role: "Backend Developer", order_index: 11 },
  { id: 13, name: "Aakash Khadka", role: "Frontend Developer", order_index: 12 },
  { id: 14, name: "Rikesh Acharya", role: "Frontend Developer", order_index: 13 },
  { id: 15, name: "Sonu Kumar Thakur", role: "Frontend Developer", order_index: 14 },
  { id: 16, name: "Rajat Pokhrel", role: "Frontend Developer", order_index: 15 },
  { id: 17, name: "Ashish Koirala", role: "Frontend Developer", order_index: 16 },
  { id: 18, name: "Dinesh Maharjan", role: "AI Specialist", order_index: 17 },
  { id: 19, name: "Laxmi Dahal", role: "Admin Officer", order_index: 18 },
  { id: 20, name: "Manoj Agrahari", role: "Backend Developer", order_index: 19 },
  { id: 21, name: "Rojan Rai", role: "Frontend Developer", order_index: 20 },
  { id: 22, name: "Bisha Bhandari", role: "Flutter Developer", order_index: 21 },
  { id: 23, name: "Anoj Budathoki", role: "Frontend Developer", order_index: 22 },
  { id: 24, name: "Anjali Jaiswal", role: "Flutter Developer", order_index: 23 },
  { id: 25, name: "Prashant Chapagain", role: "Python Developer", order_index: 24 },
  { id: 26, name: "Supendra Karki", role: "Public Health Consultant", order_index: 25 },
  { id: 27, name: "Awan Adhikari", role: "Backend Developer", img: a1, order_index: 26 },
  { id: 28, name: "Dr. Prakash Jyoti Pokharel", role: "Health Consultant", order_index: 27 },
  { id: 29, name: "Sugam Karki", role: "Backend Developer", order_index: 28 },
  { id: 30, name: "Nisha Baral", role: "Health Consultant", order_index: 29 },
  { id: 31, name: "Sneha Neupane", role: "Backend Developer", order_index: 30 },
  { id: 32, name: "Shristhi Gautam", role: "Health Consultant", order_index: 31 },
  { id: 33, name: "Unique Bhattarai", role: "Frontend Developer", order_index: 32 },
  { id: 34, name: "Krishma Acharya", role: "Backend Developer", order_index: 33 },
  { id: 35, name: "Anuja Dhungel", role: "Trainer", order_index: 34 },
  { id: 36, name: "Rupesh Giri", role: "Operation Manager", order_index: 35 },
  { id: 37, name: "Sudarshan Thapa", role: "Marketing", order_index: 36 },
  { id: 38, name: "Koshish Acharya", role: "Marketing", order_index: 37 },
  { id: 39, name: "Vinay Raut", role: "Marketing", order_index: 38 },
  { id: 40, name: "Mahesh Puri", role: "Health Consultant", order_index: 39 },
  { id: 41, name: "Binod Shah", role: "Sales/Marketing", order_index: 40 },
  { id: 42, name: "Anil Khatiwada", role: "Backend Developer", order_index: 41 },
  { id: 43, name: "Dinesh Jaiswal", role: "Senior Database Designer", order_index: 42 },
  { id: 44, name: "Ashim Ghimire", role: "Frontend Developer", order_index: 43 },
  { id: 45, name: "Sudheer Ray", role: "IT Support", order_index: 44 },
  { id: 46, name: "Jitendra Sharma", role: "Sales / Marketing", order_index: 45 },
  { id: 47, name: "Diwakar Bhattarai", role: "Backend Developer", order_index: 46 },
  { id: 48, name: "Saugat Sangraula", role: "Marketing", order_index: 47 },
];

export const projects: Project[] = [
  { id: 1, title: "Digital Health Profile", category: "web", year: "2025", description: "The Digital Health Profile solution enables the Province Health Directorate and Ministry to maintain and access comprehensive, real-time health data." },
  { id: 2, title: "School Management System", category: "web", year: "2025", description: "The School Management System (SMS) simplifies administrative tasks such as student records, attendance, grading, and timetable management." },
  { id: 3, title: "Hospital Management System", category: "web", year: "2025", description: "The Hospital Management System (HMS) streamlines hospital functions like patient records, billing, and scheduling into a unified platform." },
  { id: 4, title: "EHR/EMR and CDSS", category: "web", year: "2025", description: "Hospitals run on data — but most of that data is fragmented. We built EHR/EMR and CDSS to unify clinical workflows." },
  { id: 5, title: "Program and Planning Management System", category: "web", year: "2025", description: "This software enables municipalities and rural municipalities to manage all their programs and planning activities effectively." },
  { id: 6, title: "Inventory Management System", category: "web", year: "2025", description: "Enables efficient management of municipal inventories, including items, staff records, and purchase orders." },
  { id: 7, title: "E-Grievance Management System", category: "web", year: "2025", description: "An online platform allowing citizens to file grievances related to municipal services, enabling swift resolution." },
  { id: 8, title: "Personnel Information System (PIS)", category: "web", year: "2025", description: "An online software designed to manage employee records within government offices." },
  { id: 9, title: "EHMIS", category: "web", year: "2025", description: "The Electronic Health Management Information System is a facility-based data aggregation tool supporting public health decisions." },
];

export const services = [
  { id: "01", title: "Health Sector Solutions", description: "Specialized software solutions for healthcare management, EHR/EMR, EHMIS, Health Profile, CDSS systems." },
  { id: "02", title: "Web & Mobile Application Development", description: "Building responsive, user-friendly web applications that drive digital transformation." },
  { id: "03", title: "Custom Software Development", description: "Tailored solutions for businesses in various sectors, including healthcare, education, and more." },
  { id: "04", title: "AI Integration & Automation", description: "Developing & implementing AI models and automation to enhance decision-making and streamline processes." },
  { id: "05", title: "Website Design & Development", description: "Creating visually appealing, responsive professional websites that leave a lasting impression." },
  { id: "06", title: "Cloud Hosting & Data Solutions", description: "Secure and scalable cloud services for hosting websites, applications, and managing business data." },
];

export const testimonials = [
  { name: "Hiroshi Nagano", role: "MD, Atlier Tech", text: "Citizen Infotech developed Kansuke-Hospital Management System for us and we were thoroughly impressed by their professionalism and services." },
  { name: "Sagar Prasad Ghimire", role: "Sr. Public Health Administrator, Ministry Of Health Bagmati Province", text: "Working with Citizen Infotech was fantastic! Their inputs in automating health system is top-notch." },
  { name: "Anil Sharma", role: "Chief Administrative Officer", text: "We are extremely happy to have worked with Citizen Infotech. They have provided various IT services to our municipality especially developing IT Systems." },
];

export const stats = [
  { label: "Years of experience", value: "14+" },
  { label: "Projects delivered", value: "80+" },
  { label: "Client Served", value: "100+" },
  { label: "Business Domains Covered", value: "10+" },
];

export const trustedBy = [
  { name: "GIZ" },
  { name: "Adra" },
  { name: "ZkTEco" },
  { name: "WHO" },
  { name: "Government Of Nepal" },
];

export const processSteps = [
  { step: "01", title: "Discover", description: "We start with your goals, constraints, and users — turning intent into a clear plan with measurable outcomes." },
  { step: "02", title: "Design", description: "Information architecture, interaction flows and visual systems — built to scale with your product, not against it." },
  { step: "03", title: "Build", description: "Modern stacks, clean code, weekly demos. You see progress in real environments — not just slides." },
  { step: "04", title: "Ship & Support", description: "Confident launches with monitoring, documentation and the ongoing partnership to keep evolving." },
];

export const whyUsReasons = [
  { title: "Endless career growth", description: "We provide lots of career growth opportunities to our employees, which is reflected both financially and reputably." },
  { title: "Mentorship & learning", description: "We support peer assistance and offer mentorship programs like IT Talks and in-house courses for different roles." },
  { title: "Cozy & fun offices", description: "Our office often take out for refreshment and provide more comfortable workspace." },
  { title: "Competitive salary", description: "Our projects belong to a wide variety of industries, which will make your professional background more diverse." },
  { title: "Career change option", description: "No need to job hunt to learn new tech or switch roles—we'll support your transition within Citizen Infotech." },
  { title: "Friendly atmosphere", description: "We value people as Citizen Infotech greatest asset and ensure hierarchy never works against our employees." },
];

export const hiringSteps = [
  "Send Your CV",
  "Initial screening results",
  "Job interview",
  "Test task",
  "You're hired!",
];
