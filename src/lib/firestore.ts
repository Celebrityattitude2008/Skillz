import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, onSnapshot, orderBy, increment as fsIncrement, limit,
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
  isPro?: boolean;
  availability?: { days: string[]; startTime: string; endTime: string };
  profileViews?: number;
  whatsappClicks?: number;
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
  await updateDoc(doc(db, 'applications', id), { status });
  if (status === 'Accepted' || status === 'Rejected') {
    try {
      const appSnap = await getDoc(doc(db, 'applications', id));
      if (appSnap.exists()) {
        const app = appSnap.data() as Application;
        await addDoc(collection(db, 'notifications'), {
          userId: app.studentId,
          type: status === 'Accepted' ? 'application_accepted' : 'application_rejected',
          message: status === 'Accepted'
            ? `🎉 Your application for "${app.gigTitle}" was accepted!`
            : `Your application for "${app.gigTitle}" was not selected this time.`,
          link: '/dashboard',
          read: false,
          createdAt: Date.now(),
        });
      }
    } catch { /* don't block status update */ }
  }
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
  try {
    if (data.uid) {
      await addDoc(collection(db, 'notifications'), {
        userId: data.uid,
        type: 'new_review',
        message: `⭐ ${review.author} left you a ${review.rating}-star review!`,
        link: `/profile/${studentId}`,
        read: false,
        createdAt: Date.now(),
      });
    }
  } catch { /* silent */ }
}

// ── Notifications ─────────────────────────────────────────────────────────────
export interface AppNotification {
  id?: string;
  userId: string;
  type: 'application_accepted' | 'application_rejected' | 'new_review' | 'new_gig';
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export async function incrementProfileView(studentId: string): Promise<void> {
  try { await updateDoc(doc(db, 'students', studentId), { profileViews: fsIncrement(1) }); } catch { /* silent */ }
}

export async function incrementWhatsAppClick(studentId: string): Promise<void> {
  try { await updateDoc(doc(db, 'students', studentId), { whatsappClicks: fsIncrement(1) }); } catch { /* silent */ }
}

// ── Student lookup by email (dashboard fallback) ──────────────────────────────
export async function getStudentByEmail(email: string): Promise<StudentProfile | null> {
  const q = query(collection(db, 'students'), where('email', '==', email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as StudentProfile;
}

// ── Availability ──────────────────────────────────────────────────────────────
export async function updateAvailability(
  studentId: string,
  availability: { days: string[]; startTime: string; endTime: string }
): Promise<void> {
  await updateDoc(doc(db, 'students', studentId), { availability });
}

// ── Pro toggle ─────────────────────────────────────────────────────────────────
export async function toggleStudentPro(studentId: string, isPro: boolean): Promise<void> {
  await updateDoc(doc(db, 'students', studentId), { isPro });
}

// ── Referrals ──────────────────────────────────────────────────────────────────
export interface Referral {
  id?: string;
  referrerId: string;
  referrerUid: string;
  refereeUid: string;
  refereeEmail: string;
  createdAt: number;
}

export async function trackReferral(
  referralCode: string,
  refereeUid: string,
  refereeEmail: string
): Promise<void> {
  try {
    // referralCode is the referrer's student doc ID
    const referrerSnap = await getDoc(doc(db, 'students', referralCode));
    if (!referrerSnap.exists()) return;
    const referrer = referrerSnap.data() as StudentProfile;

    // Prevent self-referral
    if (referrer.uid === refereeUid) return;

    // Prevent duplicate referrals for this referee
    const existing = await getDocs(
      query(collection(db, 'referrals'), where('refereeUid', '==', refereeUid))
    );
    if (!existing.empty) return;

    await addDoc(collection(db, 'referrals'), {
      referrerId: referralCode,
      referrerUid: referrer.uid || '',
      refereeUid,
      refereeEmail,
      createdAt: Date.now(),
    });

    // Notify the referrer
    if (referrer.uid) {
      await addDoc(collection(db, 'notifications'), {
        userId: referrer.uid,
        type: 'new_review',
        message: `🎉 Someone signed up using your referral link! You've earned ₦500 off Pro.`,
        link: '/dashboard',
        read: false,
        createdAt: Date.now(),
      });
    }
  } catch { /* silent */ }
}

export async function getReferralsByStudent(studentId: string): Promise<Referral[]> {
  const q = query(collection(db, 'referrals'), where('referrerId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Referral));
}
