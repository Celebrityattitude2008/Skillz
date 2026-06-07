import { Navbar } from "../components/navbar";
import { Link } from "react-router";

export function TermsPage() {
  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-2xl shadow-blue-200/20 dark:shadow-slate-900/60 border border-white/60 dark:border-slate-700/40 p-8">
          <div className="mb-8">
            <h1 className="text-3xl text-slate-900 dark:text-white" style={{ fontWeight: 900 }}>Terms of Service</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3" style={{ fontWeight: 500 }}>
              These Terms govern your use of the Skillz platform. Please read them carefully before creating an account or using our services.
            </p>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>1. Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                By signing up or using Skillz, you agree to follow these Terms. If you do not agree, do not create an account or use the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>2. Account Responsibility</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                You are responsible for maintaining the security of your account and for all activity under your login. Keep your password confidential.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>3. Content and Conduct</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                All users must behave respectfully and post only accurate, lawful information. Any fraudulent or abusive behavior may result in account suspension.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>4. Service Changes</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                We may update features, policies, or pricing at any time. Continued use after changes means you accept the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>5. Limitation of Liability</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2" style={{ fontWeight: 500, lineHeight: 1.8 }}>
                Skillz is provided as-is. We are not liable for losses resulting from transactions, communications, or interactions between users.
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
