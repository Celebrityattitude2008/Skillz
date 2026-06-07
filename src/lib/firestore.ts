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

export async function deleteGig(id: string) {
  return deleteDoc(doc(db, 'gigs', id));
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

// ── Reviews ───────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  reviewerId?: string;
}

export async function addReview(
  studentId: string,
  review: Omit<Review, 'id'>
): Promise<void> {
  const studentRef = doc(db, 'students', studentId);
  const snap = await getDoc(studentRef);
  if (!snap.exists()) return;
  const data = snap.data() as StudentProfile;
  const current: Review[] = (data.reviews as Review[]) || [];
  const newReview: Review = { ...review, id: Date.now() };
  const updated = [...current, newReview];
  const avgRating =
    Math.round((updated.reduce((s, r) => s + r.rating, 0) / updated.length) * 10) / 10;
  await updateDoc(studentRef, { reviews: updated, rating: avgRating });
}
