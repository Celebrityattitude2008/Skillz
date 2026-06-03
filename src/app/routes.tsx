import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home";
import { StudentProfile } from "./pages/student-profile";
import { JobBoard } from "./pages/job-board";
import { AdminPanel } from "./pages/admin-panel";
import { AuthPage } from "./pages/auth";
import { ProfileEditor } from "./pages/profile-editor";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/jobs", Component: JobBoard },
  { path: "/profile/me", Component: ProfileEditor },
  { path: "/profile/:id", Component: StudentProfile },
  { path: "/admin", Component: AdminPanel },
  { path: "/auth", Component: AuthPage },
]);
