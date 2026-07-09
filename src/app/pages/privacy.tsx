import { Navbar } from "../components/navbar";
import { Link } from "react-router";
import { Lock, Eye, Database, Share2, Shield, UserCheck, Mail, Trash2 } from "lucide-react";

const SECTIONS = [
  {
    id: "1",
    title: "1. Who We Are",
    content: [
      "Skillz ('we', 'us', or 'our') is a campus talent marketplace based in Nigeria that connects university students with businesses and individuals seeking skilled help for gigs and short-term projects.",
      "This Privacy Policy explains what personal information we collect, how we use it, with whom we share it, and the choices you have in relation to your information when you use the Skillz platform (the 'Platform').",
      "By using the Platform, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree, please discontinue use of the Platform.",
    ],
  },
  {
    id: "2",
    title: "2. Information We Collect",
    content: [
      "Account Information: When you register, we collect your name, email address, password (stored as a secure hash), university, department, academic level, and role (student or business).",
      "Profile Information: Students may optionally provide a profile photo, bio, skills list, experience history, portfolio items, WhatsApp number, and availability details. This information is displayed publicly on your profile page.",
      "Application Data: When you apply to a gig, we store your application message and the details of your application alongside your profile data.",
      "Verification Data: If you submit an ID verification request, we may collect a copy of your student ID or government-issued identification. This is used solely for the purpose of verifying your identity and awarding a Verified badge.",
      "Usage Data: We automatically collect information about how you interact with the Platform, including pages visited, clicks, search queries, and timestamps. This is used to improve the Platform experience.",
      "Device & Technical Data: We may collect your IP address, browser type, device type, and operating system to ensure security and proper functionality of the Platform.",
    ],
  },
  {
    id: "3",
    title: "3. How We Use Your Information",
    content: [
      "To operate the Platform: Your account and profile information is used to create and manage your account, authenticate you, and provide Platform features including profile listing, gig applications, and messaging.",
      "To match students with opportunities: Your profile data — including skills, university, and experience — may be used to surface your profile to relevant employers or suggest gigs to you.",
      "To provide Skillz Pro features: If you subscribe to Skillz Pro, we use your data to provide analytics (such as profile views and WhatsApp click counts), featured placement, and other Pro-tier benefits.",
      "To communicate with you: We may send you email notifications about your account activity, application updates, gig matches, and Platform announcements. You can opt out of non-essential communications at any time.",
      "To improve the Platform: Aggregated and anonymised usage data helps us understand how users interact with Skillz and guides product decisions.",
      "To maintain security: We use your information to detect and prevent fraud, abuse, and other harmful activity on the Platform.",
      "To comply with the law: We may process or disclose your information as required by applicable Nigerian law or in response to lawful requests from authorities.",
    ],
  },
  {
    id: "4",
    title: "4. How We Share Your Information",
    content: [
      "Public Profile: Your student profile — including name, photo, bio, skills, university, and portfolio — is publicly visible to anyone visiting the Platform, whether or not they have an account. Your WhatsApp number is only visible if you have enabled it on your profile.",
      "With Employers: When you apply to a gig, the Employer who posted that gig can view your profile and application message.",
      "Service Providers: We use trusted third-party services to help operate the Platform, including Firebase (Google) for authentication and database storage. These providers are bound by confidentiality obligations and may only use your data to perform services on our behalf.",
      "Legal Requirements: We may disclose your information if required to do so by law, court order, or governmental authority in Nigeria or another applicable jurisdiction.",
      "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your information is transferred and becomes subject to a different privacy policy.",
      "We do not sell, rent, or trade your personal information to third parties for their marketing purposes.",
    ],
  },
  {
    id: "5",
    title: "5. Data Storage & Security",
    content: [
      "Your data is stored securely using Google Firebase, which provides industry-standard encryption at rest and in transit. Firebase infrastructure is hosted in secure Google data centres.",
      "Passwords are never stored in plain text. We use Firebase Authentication's built-in secure hashing to protect your credentials.",
      "Despite our security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information and encourage you to use a strong, unique password.",
      "We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymise your personal data within a reasonable period, except where retention is required by law.",
    ],
  },
  {
    id: "6",
    title: "6. Cookies & Tracking",
    content: [
      "Skillz may use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyse how the Platform is used.",
      "Firebase and other services we use may set their own cookies as part of providing authentication and analytics functionality.",
      "You can configure your browser to refuse cookies, but doing so may affect the functionality of the Platform, including your ability to stay logged in.",
    ],
  },
  {
    id: "7",
    title: "7. Your Rights & Choices",
    content: [
      "Access & Correction: You can view and update most of your personal information at any time through your profile editor at /profile/me. If you need assistance correcting data you cannot edit yourself, contact us.",
      "Account Deletion: You may request deletion of your account and associated personal data by emailing skillz@zohomail.com. We will process deletion requests within 30 days, subject to any legal obligations to retain certain records.",
      "Withdraw Consent: Where we rely on your consent to process your data (such as displaying your WhatsApp number), you can withdraw consent at any time by updating your profile settings.",
      "Opt Out of Communications: You can unsubscribe from non-essential email communications by following the unsubscribe link in any marketing email or by contacting us.",
      "Data Portability: You may request a copy of the personal data we hold about you in a structured, machine-readable format by emailing skillz@zohomail.com.",
    ],
  },
  {
    id: "8",
    title: "8. Children's Privacy",
    content: [
      "The Platform is intended for users aged 16 and older. We do not knowingly collect personal information from anyone under the age of 16.",
      "If we become aware that we have collected personal information from a child under 16 without verifiable parental consent, we will take steps to delete that information promptly.",
      "If you believe we may have inadvertently collected information from a minor, please contact us at skillz@zohomail.com.",
    ],
  },
  {
    id: "9",
    title: "9. Third-Party Links",
    content: [
      "The Platform may contain links to third-party websites or services, including employer websites and portfolio platforms. We are not responsible for the privacy practices of these external sites.",
      "We encourage you to review the privacy policies of any third-party sites you visit through links on the Platform.",
    ],
  },
  {
    id: "10",
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will notify users via email or a notice on the Platform.",
      "The date at the top of this page indicates when the policy was last revised. Continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.",
      "We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.",
    ],
  },
  {
    id: "11",
    title: "11. Contact Us",
    content: [
      "If you have any questions, concerns, or requests related to this Privacy Policy or the handling of your personal data, please contact us:",
      "Email: skillz@zohomail.com",
      "We aim to respond to all privacy-related enquiries within 5 business days.",
    ],
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 py-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-sm" style={{ fontWeight: 600 }}>Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white mb-3" style={{ fontWeight: 900 }}>Privacy Policy</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl" style={{ fontWeight: 500 }}>
            Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we keep it safe.
          </p>
          <p className="text-white/60 text-xs mt-4" style={{ fontWeight: 500 }}>Last updated: July 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-slate-800/80 rounded-2xl border border-white/60 dark:border-slate-700/40 shadow-sm p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#section-${s.id}`}
                    className="block text-xs text-slate-600 dark:text-slate-300 hover:text-violet-500 dark:hover:text-violet-400 py-1 transition-colors leading-snug"
                    style={{ fontWeight: 600 }}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-6">

            {/* Quick summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              {[
                { Icon: Database, label: "Data stored", value: "Firebase (Google)" },
                { Icon: Eye, label: "Profile visibility", value: "Public by default" },
                { Icon: Share2, label: "Data sold?", value: "Never" },
                { Icon: Trash2, label: "Delete account", value: "Anytime, on request" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-white/60 dark:border-slate-700/40 shadow-sm p-4">
                  <Icon className="w-5 h-5 text-violet-500 mb-2" />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider" style={{ fontWeight: 700 }}>{label}</p>
                  <p className="text-slate-800 dark:text-white text-xs sm:text-sm mt-0.5 leading-snug" style={{ fontWeight: 700 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Commitment banner */}
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/40 rounded-2xl p-5 flex gap-4 items-start">
              <Shield className="w-6 h-6 text-violet-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-violet-800 dark:text-violet-300 text-sm" style={{ fontWeight: 800 }}>Our commitment to you</p>
                <p className="text-violet-700 dark:text-violet-400 text-sm mt-1" style={{ fontWeight: 500 }}>
                  We collect only what we need to run the platform. We never sell your personal data. You can delete your account at any time.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 divide-y divide-slate-100 dark:divide-slate-700/50">
              {SECTIONS.map((section) => (
                <div key={section.id} id={`section-${section.id}`} className="p-6 sm:p-8 scroll-mt-24">
                  <h2 className="text-lg sm:text-xl text-slate-900 dark:text-white mb-3" style={{ fontWeight: 800 }}>
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((para, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed" style={{ fontWeight: 500 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-br from-violet-500/10 to-purple-100/30 dark:from-violet-900/20 dark:to-slate-800/40 rounded-2xl border border-violet-200/50 dark:border-violet-700/30 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <UserCheck className="w-8 h-8 text-violet-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Want to access or delete your data?</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5" style={{ fontWeight: 500 }}>
                  Email us at{" "}
                  <a href="mailto:skillz@zohomail.com" className="text-violet-500 hover:underline">skillz@zohomail.com</a>{" "}
                  and we'll respond within 5 business days.
                </p>
              </div>
              <Link
                to="/"
                className="text-sm text-violet-500 hover:underline whitespace-nowrap"
                style={{ fontWeight: 700 }}
              >
                ← Back to Skillz
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
