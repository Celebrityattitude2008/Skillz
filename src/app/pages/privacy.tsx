import { Navbar } from "../components/navbar";
import { Link } from "react-router";

export function PrivacyPage() {
  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-2xl shadow-blue-200/20 dark:shadow-slate-900/60 border border-white/60 dark:border-slate-700/40 p-8">
          <div className="mb-8">
            <h1 className="text-3xl text-slate-900 dark:text-white" style={{ fontWeight: 900 }}>Privacy Policy</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3" style={{ fontWeight: 500 }}>
              This Privacy Policy describes how Skillz collects, uses, and protects your information when you use our platform.
            </p>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>1. Information We Collect</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                We collect the information you provide during account creation, including name, email, role, and university information for students. We also store any profile or application details you submit.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>2. How We Use Information</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                Your information is used to operate the platform, provide the service, authenticate your account, and improve your experience.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>3. Data Sharing</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                We do not sell your personal data. We may share information with service providers who help us run the platform, and we may disclose data if required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>4. Security</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                We use reasonable measures to protect your data. However, no system is completely secure, so please keep your login credentials safe.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>5. Contact</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                If you have questions about this policy, contact us through the support details listed on the Skillz platform.
              </p>
            </div>
          </section>

          <div className="mt-10 text-sm text-slate-500 dark:text-slate-400">
            <p style={{ fontWeight: 500 }}>Need to go back?</p>
            <Link to="/auth" className="text-[#38B6FF] font-semibold">Return to login / signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
