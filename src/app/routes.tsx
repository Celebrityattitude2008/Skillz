import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home";
import { ProfilesPage } from "./pages/profiles";
import { StudentProfile } from "./pages/student-profile";
import { JobBoard } from "./pages/job-board";
import { AdminPanel } from "./pages/admin-panel";
import { AuthPage } from "./pages/auth";
import { ProfileEditor } from "./pages/profile-editor";
import { TermsPage } from "./pages/terms";
import { PrivacyPage } from "./pages/privacy";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/jobs", Component: JobBoard },
  { path: "/profiles", Component: ProfilesPage },
  { path: "/profile/me", Component: ProfileEditor },
  { path: "/profile/:id", Component: StudentProfile },
  { path: "/admin", Component: AdminPanel },
  { path: "/auth", Component: AuthPage },
  { path: "/terms", Component: TermsPage },
  { path: "/privacy", Component: PrivacyPage },
]);
