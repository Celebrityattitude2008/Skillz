import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { StudentProfile } from "./pages/student-profile";
import { JobBoard } from "./pages/job-board";
import { AdminPanel } from "./pages/admin-panel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/profile/:id",
    Component: StudentProfile,
  },
  {
    path: "/jobs",
    Component: JobBoard,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
]);
