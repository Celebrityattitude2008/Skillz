import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface Gig {
  id?: string;
  title: string;
  company: string;
  description: string;
  budget: string;
  category: string;
  skills: string[];
  location: string;
  postedDate: string;
  applicants: number;
  postedBy?: string;
  deadline?: string;
  status?: 'Open' | 'In Progress' | 'Completed';
}

export interface StudentProfile {
  id?: string;
  uid?: string;
  name: string;
  major: string;
  year: string;
  university: string;
  image: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  hourlyRate?: string;
  experience: { role: string; organization: string; period: string; description: string }[];
  education: { degree: string; university: string; period: string; gpa: string };
  portfolio: { id: number; image: string; title: string; url?: string }[];
  whatsappNumber: string;
  whatsappEnabled: boolean;
  reviews: { id: number; author: string; role: string; rating: number; comment: string; date: string }[];
  rating: number;
  completedGigs: number;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  role: string;
  joinDate: string;
  gigs: number;
}

export interface Application {
  id?: string;
  gigId: string;
  gigTitle: string;
  studentId: string;
  studentName: string;
  studentImage?: string;
  studentProfileId?: string;
  coverLetter?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedDate: string;
  gigPosterId?: string;
}

export interface AdminUser {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: string;
  joinDate: string;
  gigs: number;
}

export interface FlaggedItem {
  id?: string;
  type: string;
  title: string;
  reporter: string;
  date: string;
  reason: string;
}

export interface PendingVerification {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  major: string;
  year: string;
  university?: string;
  studentId: string;
  idImage: string;
  submittedDate: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

const SEED_GIGS: Omit<Gig, 'id'>[] = [
  { title: "Logo Design for Coffee Shop", company: "Local Coffee Co.", description: "Looking for a creative designer to create a modern, minimalist logo for our new coffee shop. Must include brand colors and multiple format deliverables.", budget: "$500", applicants: 12, postedDate: "2 days ago", location: "Remote", category: "Design", skills: ["Logo Design", "Branding", "Adobe Illustrator"], status: "Open" },
  { title: "Website Development — E-commerce", company: "Fashion Boutique", description: "Need a full-stack developer to build an e-commerce website with payment integration, product catalog, and admin panel.", budget: "$2,500", applicants: 8, postedDate: "1 week ago", location: "Hybrid", category: "Dev", skills: ["React", "Node.js", "E-commerce"], status: "Open" },
  { title: "Social Media Content Creation", company: "Tech Startup", description: "Seeking a creative content creator to produce engaging social media posts, reels, and stories. Must have experience with Instagram and TikTok.", budget: "$800/mo", applicants: 15, postedDate: "3 days ago", location: "Remote", category: "Marketing", skills: ["Content Creation", "Social Media", "Video Editing"], status: "Open" },
  { title: "Mobile App UI/UX Design", company: "Fitness App Co.", description: "Looking for an experienced UI/UX designer to redesign our fitness tracking app. Need wireframes, mockups, and interactive prototypes.", budget: "$1,200", applicants: 20, postedDate: "5 days ago", location: "Remote", category: "Design", skills: ["UI/UX", "Figma", "Mobile Design"], status: "In Progress" },
  { title: "Event Photography Coverage", company: "Alumni Association", description: "Need a skilled photographer for our annual alumni reunion event. Includes candid shots, group photos, and event coverage.", budget: "$400", applicants: 6, postedDate: "1 day ago", location: "On Campus", category: "Photo", skills: ["Photography", "Photo Editing", "Lightroom"], status: "Open" },
  { title: "Tech Blog Writing — 5 Articles/Month", company: "Tech Review Blog", description: "Seeking tech-savvy writers to create in-depth reviews and articles about the latest gadgets and software. 1000+ words each.", budget: "$600/mo", applicants: 18, postedDate: "4 days ago", location: "Remote", category: "Writing", skills: ["Technical Writing", "SEO", "Research"], status: "Open" },
];

const SEED_STUDENTS: Omit<StudentProfile, 'id'>[] = [
  {
    name: "Sarah Johnson", major: "Graphic Design", year: "Senior", university: "University of Lagos",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=600&h=600&fit=crop&auto=format",
    email: "sarah.j@unilag.edu.ng", phone: "+234 801 234 5678", location: "Lagos, Nigeria",
    bio: "Creative and passionate graphic designer with 3+ years of experience in branding, digital design, and illustration.",
    skills: ["UI/UX Design", "Branding", "Illustration", "Figma", "Adobe Suite", "Typography"],
    hourlyRate: "₦15,000/hr",
    experience: [
      { role: "Freelance Graphic Designer", organization: "Various Clients", period: "2023 – Present", description: "Created brand identities, marketing materials, and digital designs for 15+ clients." },
      { role: "Design Intern", organization: "Creative Agency Inc.", period: "Summer 2024", description: "Collaborated with senior designers on client projects and brand development." },
    ],
    education: { degree: "Bachelor of Fine Arts in Graphic Design", university: "University of Lagos", period: "2021 – 2025", gpa: "3.8 / 4.0" },
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&auto=format", title: "Brand Identity — Tech Startup" },
      { id: 2, image: "https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?w=600&h=500&fit=crop&auto=format", title: "Poster Design Collection" },
      { id: 3, image: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=600&h=350&fit=crop&auto=format", title: "Website UI Design" },
      { id: 4, image: "https://images.unsplash.com/photo-1623577284502-d65cdc6ba0b6?w=600&h=450&fit=crop&auto=format", title: "Creative Photography" },
    ],
    whatsappNumber: "+2348012345678", whatsappEnabled: true,
    reviews: [
      { id: 1, author: "Michael Chen", role: "Tech Startup Founder", rating: 5, comment: "Working with Sarah was an absolute pleasure! Her creative vision and attention to detail transformed our startup's branding completely.", date: "May 2026" },
      { id: 2, author: "Emily Rodriguez", role: "Small Business Owner", rating: 5, comment: "Sarah delivered exceptional work on time and exceeded all our expectations. Highly professional and creative!", date: "April 2026" },
    ],
    rating: 4.9, completedGigs: 34, verificationStatus: "Verified", role: "Student", joinDate: "Jan 2026", gigs: 15,
  },
  {
    name: "Marcus Williams", major: "Computer Science", year: "Junior", university: "Covenant University",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format",
    email: "marcus.w@covenantuniversity.edu.ng", phone: "+234 802 345 6789", location: "Ota, Ogun State",
    bio: "Full-stack developer specializing in React and Node.js. Passionate about building scalable web applications.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "GraphQL"],
    hourlyRate: "₦18,000/hr",
    experience: [
      { role: "Freelance Developer", organization: "Various Clients", period: "2024 – Present", description: "Built web apps and dashboards for local businesses." },
    ],
    education: { degree: "Bachelor of Science in Computer Science", university: "Covenant University", period: "2022 – 2026", gpa: "3.9 / 4.0" },
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop&auto=format", title: "E-commerce Dashboard" },
      { id: 2, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&auto=format", title: "Mobile App Backend" },
    ],
    whatsappNumber: "+2348023456789", whatsappEnabled: false,
    reviews: [
      { id: 1, author: "Lisa Thompson", role: "Startup CEO", rating: 5, comment: "Marcus built our entire platform in record time. Clean code, great communication!", date: "May 2026" },
    ],
    rating: 4.8, completedGigs: 27, verificationStatus: "Verified", role: "Student", joinDate: "Feb 2026", gigs: 12,
  },
  {
    name: "Aisha Patel", major: "Marketing", year: "Sophomore", university: "University of Ibadan",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&auto=format",
    email: "aisha.p@ui.edu.ng", phone: "+234 803 456 7890", location: "Ibadan, Oyo State",
    bio: "Digital marketing specialist focused on content strategy, SEO, and social media growth.",
    skills: ["Content Strategy", "SEO", "Social Media", "Analytics", "Copywriting"],
    hourlyRate: "₦12,000/hr",
    experience: [
      { role: "Social Media Manager", organization: "Local Restaurant Chain", period: "2025 – Present", description: "Grew Instagram following from 2K to 25K in 6 months." },
    ],
    education: { degree: "Bachelor of Business Administration in Marketing", university: "University of Ibadan", period: "2024 – 2028", gpa: "4.0 / 4.0" },
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop&auto=format", title: "Instagram Growth Campaign" },
    ],
    whatsappNumber: "+2348034567890", whatsappEnabled: true,
    reviews: [
      { id: 1, author: "James Kim", role: "Restaurant Owner", rating: 5, comment: "Aisha tripled our social media engagement. Absolutely incredible results!", date: "June 2026" },
    ],
    rating: 5.0, completedGigs: 19, verificationStatus: "Verified", role: "Student", joinDate: "Mar 2026", gigs: 18,
  },
];

const SEED_VERIFICATIONS: Omit<PendingVerification, 'id'>[] = [
  { name: "Emily Rodriguez", email: "emily.r@unn.edu.ng", major: "Computer Science", year: "Junior", university: "University of Nigeria Nsukka", studentId: "STU-2023-4567", idImage: "https://images.unsplash.com/photo-1668903678359-e810dd966016?w=600&h=350&fit=crop&auto=format", submittedDate: "May 30, 2026", status: "Pending" },
  { name: "James Wilson", email: "j.wilson@oau.edu.ng", major: "Graphic Design", year: "Senior", university: "Obafemi Awolowo University", studentId: "STU-2021-8901", idImage: "https://images.unsplash.com/photo-1668903678359-e810dd966016?w=600&h=350&fit=crop&auto=format", submittedDate: "June 1, 2026", status: "Pending" },
];

const SEED_FLAGGED = [
  { type: "Gig Post", title: "Suspicious gig posting — potential scam", reporter: "User #2547", date: "June 2, 2026", reason: "Contains suspicious payment request" },
  { type: "Profile", title: "Inappropriate portfolio content", reporter: "User #1893", date: "June 1, 2026", reason: "Contains copyrighted material" },
];

export async function seedFirestore() {
  const gigsSnap = await getDocs(collection(db, 'gigs'));
  if (gigsSnap.empty) {
    for (const gig of SEED_GIGS) await addDoc(collection(db, 'gigs'), gig);
  }
  const studentsSnap = await getDocs(collection(db, 'students'));
  if (studentsSnap.empty) {
    for (const student of SEED_STUDENTS) await addDoc(collection(db, 'students'), student);
  }
  const verifSnap = await getDocs(collection(db, 'pendingVerifications'));
  if (verifSnap.empty) {
    for (const v of SEED_VERIFICATIONS) await addDoc(collection(db, 'pendingVerifications'), v);
  }
  const flaggedSnap = await getDocs(collection(db, 'flaggedContent'));
  if (flaggedSnap.empty) {
    for (const f of SEED_FLAGGED) await addDoc(collection(db, 'flaggedContent'), f);
  }
  const usersSnap = await getDocs(collection(db, 'adminUsers'));
  if (usersSnap.empty) {
    const adminUsers: Omit<AdminUser, 'id'>[] = [
      { name: "Sarah Johnson", email: "sarah.j@unilag.edu.ng", role: "Student", verificationStatus: "Verified", joinDate: "Jan 2026", gigs: 15 },
      { name: "Michael Chen", email: "m.chen@business.com", role: "Client", verificationStatus: "Verified", joinDate: "Feb 2026", gigs: 3 },
      { name: "Emily Rodriguez", email: "emily.r@unn.edu.ng", role: "Student", verificationStatus: "Pending", joinDate: "May 2026", gigs: 0 },
      { name: "James Wilson", email: "j.wilson@oau.edu.ng", role: "Student", verificationStatus: "Pending", joinDate: "May 2026", gigs: 0 },
      { name: "Lisa Thompson", email: "lisa.t@startup.io", role: "Client", verificationStatus: "Verified", joinDate: "Mar 2026", gigs: 7 },
    ];
    for (const u of adminUsers) await addDoc(collection(db, 'adminUsers'), u);
  }
}

// ── Gigs ─────────────────────────────────────────────────────────────────────
export async function getGigs(): Promise<Gig[]> {
  const snap = await getDocs(collection(db, 'gigs'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Gig));
}

export async function addGig(gig: Omit<Gig, 'id'>) {
  return addDoc(collection(db, 'gigs'), gig);
}

export async function updateGigStatus(id: string, status: 'Open' | 'In Progress' | 'Completed') {
  return updateDoc(doc(db, 'gigs', id), { status });
}

// ── Students ──────────────────────────────────────────────────────────────────
export async function getStudents(): Promise<StudentProfile[]> {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudentProfile));
}

export async function getStudentById(id: string): Promise<StudentProfile | null> {
  const snap = await getDoc(doc(db, 'students', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as StudentProfile;
}

export async function getStudentByUid(uid: string): Promise<StudentProfile | null> {
  const q = query(collection(db, 'students'), where('uid', '==', uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as StudentProfile;
}

export async function createStudentProfile(uid: string, data: Omit<StudentProfile, 'id' | 'uid'>): Promise<string> {
  const r = await addDoc(collection(db, 'students'), { ...data, uid });
  return r.id;
}

export async function updateStudentProfile(id: string, data: Partial<StudentProfile>) {
  return updateDoc(doc(db, 'students', id), data as Record<string, unknown>);
}

export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  const storageRef = ref(storage, `profile-photos/${uid}/${file.name}`);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

// ── Applications ──────────────────────────────────────────────────────────────
export async function applyToGig(app: Omit<Application, 'id'>): Promise<string> {
  const r = await addDoc(collection(db, 'applications'), app);
  if (app.gigId) {
    const gigSnap = await getDoc(doc(db, 'gigs', app.gigId));
    if (gigSnap.exists()) {
      const current = gigSnap.data().applicants || 0;
      await updateDoc(doc(db, 'gigs', app.gigId), { applicants: current + 1 });
    }
  }
  return r.id;
}

export async function hasApplied(gigId: string, studentId: string): Promise<boolean> {
  const q = query(collection(db, 'applications'), where('gigId', '==', gigId), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getApplicationsByGig(gigId: string): Promise<Application[]> {
  const q = query(collection(db, 'applications'), where('gigId', '==', gigId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application));
}

export async function getApplicationsByStudent(studentId: string): Promise<Application[]> {
  const q = query(collection(db, 'applications'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application));
}

export async function updateApplicationStatus(id: string, status: 'Pending' | 'Accepted' | 'Rejected') {
  return updateDoc(doc(db, 'applications', id), { status });
}

// ── Verification ──────────────────────────────────────────────────────────────
export async function submitVerificationRequest(data: Omit<PendingVerification, 'id' | 'submittedDate'>) {
  const existing = await getDocs(query(collection(db, 'pendingVerifications'), where('uid', '==', data.uid)));
  if (!existing.empty) {
    return updateDoc(doc(db, 'pendingVerifications', existing.docs[0].id), {
      ...data,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
    });
  }
  return addDoc(collection(db, 'pendingVerifications'), {
    ...data,
    submittedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
  });
}

export async function uploadVerificationId(uid: string, file: File): Promise<string> {
  const storageRef = ref(storage, `verification-ids/${uid}/${file.name}`);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function getAdminUsers(): Promise<AdminUser[]> {
  const snap = await getDocs(collection(db, 'adminUsers'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUser));
}

export async function updateAdminUser(id: string, data: Partial<AdminUser>) {
  return updateDoc(doc(db, 'adminUsers', id), data);
}

export async function getUsers(): Promise<AdminUser[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUser));
}

export async function updateUser(id: string, data: Partial<AdminUser>) {
  return updateDoc(doc(db, 'users', id), data);
}

export async function getPendingVerifications(): Promise<PendingVerification[]> {
  const snap = await getDocs(collection(db, 'pendingVerifications'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PendingVerification));
}

export async function deleteVerification(id: string) {
  return deleteDoc(doc(db, 'pendingVerifications', id));
}

export async function approveVerification(v: PendingVerification) {
  if (!v.id) return;
  await updateDoc(doc(db, 'pendingVerifications', v.id), { status: 'Approved' });
  if (v.uid) {
    const studentSnap = await getDocs(query(collection(db, 'students'), where('uid', '==', v.uid)));
    if (!studentSnap.empty) {
      await updateDoc(doc(db, 'students', studentSnap.docs[0].id), { verificationStatus: 'Verified' });
    }
    await setDoc(doc(db, 'users', v.uid), { verificationStatus: 'Verified' }, { merge: true });
  }
}

export async function getFlaggedContent(): Promise<FlaggedItem[]> {
  const snap = await getDocs(collection(db, 'flaggedContent'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FlaggedItem));
}

export async function deleteFlaggedItem(id: string) {
  return deleteDoc(doc(db, 'flaggedContent', id));
}

export async function getSpotlightStudent(): Promise<string | null> {
  const snap = await getDoc(doc(db, 'settings', 'spotlight'));
  if (!snap.exists()) return null;
  return snap.data().studentId || null;
}

export async function setSpotlightStudent(studentId: string) {
  return setDoc(doc(db, 'settings', 'spotlight'), { studentId });
}

export async function saveUserProfile(uid: string, data: Partial<StudentProfile>) {
  return setDoc(doc(db, 'users', uid), data, { merge: true });
}
