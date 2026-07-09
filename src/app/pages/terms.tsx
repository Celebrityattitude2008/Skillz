import { Navbar } from "../components/navbar";
import { Link } from "react-router";
import { FileText, Shield, Users, AlertTriangle, CreditCard, Gavel, Mail } from "lucide-react";

const SECTIONS = [
  {
    id: "1",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using Skillz ('the Platform'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to all of these Terms, you may not use the Platform.",
      "These Terms apply to all visitors, students, businesses, and any other users who access or use the Platform. Skillz reserves the right to update or modify these Terms at any time. Continued use of the Platform after any such changes constitutes your acceptance of the new Terms.",
      "You must be at least 16 years of age to create an account on Skillz. By using the Platform, you represent and warrant that you meet this age requirement.",
    ],
  },
  {
    id: "2",
    title: "2. Description of Service",
    content: [
      "Skillz is a campus talent marketplace that connects Nigerian university students with businesses and individuals looking to hire for gigs, freelance projects, and short-term work. The Platform allows students to create profiles, showcase their skills, apply to gig listings, and receive payments.",
      "Skillz acts as an intermediary platform only. We do not employ any student listed on the Platform, nor are we a party to any contract or agreement entered into between students and employers/businesses through the Platform.",
      "We offer both a free tier and a paid Skillz Pro subscription. Features available to free and Pro users are described on the Platform and are subject to change.",
    ],
  },
  {
    id: "3",
    title: "3. Account Registration & Responsibility",
    content: [
      "To use most features of Skillz, you must register for an account using a valid email address and create a password. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.",
      "You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately at skillz@zohomail.com if you suspect any unauthorized use of your account.",
      "You may not share your account with any other person or use another person's account without permission. Skillz reserves the right to suspend or terminate accounts that violate this policy.",
      "Students must provide accurate academic and personal information including their university, department, and level. Providing false information may result in immediate account termination.",
    ],
  },
  {
    id: "4",
    title: "4. Student Profiles & Content",
    content: [
      "As a student, you may create a profile that includes your photo, bio, skills, portfolio items, and contact details. You are solely responsible for all content you submit, post, or display on your profile.",
      "By uploading content to Skillz, you grant Skillz a non-exclusive, royalty-free, worldwide license to use, display, and distribute that content for the purpose of operating and promoting the Platform.",
      "You must not post content that is false, misleading, defamatory, obscene, offensive, or that infringes any third party's intellectual property rights. Skillz may remove any content that violates these Terms at its sole discretion.",
      "Portfolio items, work samples, and credentials you display must be your own original work. Misrepresenting your qualifications or work history is grounds for immediate account removal.",
    ],
  },
  {
    id: "5",
    title: "5. Gigs & Applications",
    content: [
      "Businesses and individuals ('Employers') may post gig listings on the Platform. Skillz does not verify the accuracy or legitimacy of gig listings. Students are encouraged to research Employers before accepting any engagement.",
      "When a student applies to a gig, they agree that their profile information and application message will be shared with the Employer. Skillz does not guarantee that any application will result in a successful hire.",
      "Any agreement entered into between a student and an Employer is solely between those parties. Skillz is not responsible for ensuring payment, quality of work, or the fulfillment of any obligations arising from such agreements.",
      "Employers must post only legitimate, lawful opportunities. Posting fraudulent, illegal, or exploitative gigs is strictly prohibited and will result in removal from the Platform.",
    ],
  },
  {
    id: "6",
    title: "6. Skillz Pro Subscription",
    content: [
      "Skillz Pro is a premium subscription tier available to students at ₦2,000/month. Pro members receive benefits including a Gold Pro Badge, boosted search placement, an analytics dashboard, a booking calendar, and eligibility to be featured on the homepage.",
      "Subscriptions are processed via email request to skillz@zohomail.com and payment is arranged directly. Skillz reserves the right to modify Pro pricing or features with reasonable notice.",
      "Skillz Pro benefits are non-transferable and linked to a single student account. Sharing Pro access with other accounts is prohibited.",
      "Refunds for Pro subscriptions are considered on a case-by-case basis. Contact us at skillz@zohomail.com within 7 days of a charge to request a review.",
    ],
  },
  {
    id: "7",
    title: "7. Prohibited Conduct",
    content: [
      "You agree not to use the Platform to: (a) post false, inaccurate, misleading, defamatory, or offensive content; (b) impersonate any person or entity; (c) engage in spam, phishing, or any unsolicited commercial messaging; (d) attempt to hack, scrape, or reverse-engineer any part of the Platform; (e) post or transmit any content containing viruses, malware, or harmful code.",
      "You must not use Skillz to facilitate illegal activity of any kind, including fraud, money laundering, or violation of any applicable Nigerian or international law.",
      "Harassment, bullying, or threatening behavior toward any other user on the Platform is strictly prohibited. Skillz may report serious violations to the relevant authorities.",
      "Any attempt to circumvent Skillz's role as the intermediary — for example, by directing transactions off-platform to avoid paying any applicable fees — is prohibited.",
    ],
  },
  {
    id: "8",
    title: "8. Intellectual Property",
    content: [
      "The Skillz name, logo, branding, design, and all software comprising the Platform are owned by Skillz and are protected by Nigerian and international intellectual property laws. You may not copy, reproduce, or create derivative works from any part of the Platform without express written permission.",
      "All trademarks, service marks, and trade names used on the Platform are the property of Skillz or their respective owners.",
      "If you believe any content on the Platform infringes your intellectual property rights, please contact us at skillz@zohomail.com with the details of your claim.",
    ],
  },
  {
    id: "9",
    title: "9. Termination",
    content: [
      "Skillz reserves the right to suspend or permanently terminate your account at any time, with or without notice, for any violation of these Terms, or for any other reason at Skillz's sole discretion.",
      "You may terminate your account at any time by contacting us at skillz@zohomail.com. Upon termination, your right to use the Platform ceases immediately.",
      "Provisions of these Terms that by their nature should survive termination — including intellectual property rights, disclaimers, and limitation of liability — shall survive.",
    ],
  },
  {
    id: "10",
    title: "10. Disclaimer & Limitation of Liability",
    content: [
      "The Platform is provided on an \'as-is\' and \'as-available\' basis without warranties of any kind, either express or implied. Skillz does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.",
      "To the maximum extent permitted by applicable law, Skillz and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or other intangible losses, resulting from your use of or inability to use the Platform.",
      "Skillz's total liability to you for any claims arising from your use of the Platform shall not exceed the amount you paid to Skillz in the 3 months preceding the claim.",
    ],
  },
  {
    id: "11",
    title: "11. Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.",
      "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.",
    ],
  },
  {
    id: "12",
    title: "12. Contact Us",
    content: [
      "If you have any questions about these Terms of Service, please reach out to us:",
      "Email: skillz@zohomail.com",
      "We aim to respond to all enquiries within 2–3 business days.",
    ],
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#2fa8f0] to-[#1a6fcc] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 py-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-sm" style={{ fontWeight: 600 }}>Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white mb-3" style={{ fontWeight: 900 }}>Terms of Service</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl" style={{ fontWeight: 500 }}>
            Please read these terms carefully. They govern your use of the Skillz platform and outline the rights and responsibilities of all users.
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
                    className="block text-xs text-slate-600 dark:text-slate-300 hover:text-[#38B6FF] dark:hover:text-[#38B6FF] py-1 transition-colors leading-snug"
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

            {/* Quick info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
              {[
                { Icon: Users, label: "Who it applies to", value: "All Skillz users" },
                { Icon: Shield, label: "Platform type", value: "Campus talent marketplace" },
                { Icon: Gavel, label: "Governing law", value: "Federal Republic of Nigeria" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-white/60 dark:border-slate-700/40 shadow-sm p-4">
                  <Icon className="w-5 h-5 text-[#38B6FF] mb-2" />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider" style={{ fontWeight: 700 }}>{label}</p>
                  <p className="text-slate-800 dark:text-white text-sm mt-0.5" style={{ fontWeight: 700 }}>{value}</p>
                </div>
              ))}
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
            <div className="bg-gradient-to-br from-[#38B6FF]/10 to-blue-100/30 dark:from-blue-900/20 dark:to-slate-800/40 rounded-2xl border border-[#38B6FF]/20 dark:border-blue-700/30 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Mail className="w-8 h-8 text-[#38B6FF] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Questions about these Terms?</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5" style={{ fontWeight: 500 }}>
                  We're here to help. Reach us at{" "}
                  <a href="mailto:skillz@zohomail.com" className="text-[#38B6FF] hover:underline">skillz@zohomail.com</a>
                </p>
              </div>
              <Link
                to="/"
                className="text-sm text-[#38B6FF] hover:underline whitespace-nowrap"
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
