import { createBrowserRouter, Outlet } from "react-router";
import { HomePage } from "./pages/home";
import { ProfilesPage } from "./pages/profiles";
import { StudentProfile } from "./pages/student-profile";
import { JobBoard } from "./pages/job-board";
import { AdminPanel } from "./pages/admin-panel";
import { AuthPage } from "./pages/auth";
import { ProfileEditor } from "./pages/profile-editor";
import { TermsPage } from "./pages/terms";
import { PrivacyPage } from "./pages/privacy";
import { DashboardPage } from "./pages/dashboard";
import { ProUpgradeModal } from "./components/pro-upgrade-modal";

function RootLayout() {
  return (
    <>
      <Outlet />
      <ProUpgradeModal />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", Component: HomePage },
      { path: "/dashboard", Component: DashboardPage },
      { path: "/jobs", Component: JobBoard },
      { path: "/profiles", Component: ProfilesPage },
      { path: "/profile/me", Component: ProfileEditor },
      { path: "/profile/:id", Component: StudentProfile },
      { path: "/admin", Component: AdminPanel },
      { path: "/auth", Component: AuthPage },
      { path: "/terms", Component: TermsPage },
      { path: "/privacy", Component: PrivacyPage },
    ],
  },
]);
