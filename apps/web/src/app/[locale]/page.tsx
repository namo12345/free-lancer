import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-600">
                {tc("appName")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/gigs"
                className="text-sm font-medium text-gray-700 hover:text-brand-600"
              >
                {tc("search")}
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-brand-600"
              >
                {tc("login")}
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
              >
                {tc("signup")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI-Powered Matching · 100% Free
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3.5 text-base font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5"
              >
                {t("hero.ctaEmployer")}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                href="/gigs"
                className="inline-flex items-center px-6 py-3.5 text-base font-medium text-brand-700 bg-white rounded-lg hover:bg-brand-50 border border-brand-200 transition-all hover:-translate-y-0.5"
              >
                {t("hero.ctaFreelancer")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-600">2,800+</p>
              <p className="mt-1 text-sm text-gray-600">Active Freelancers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-600">500+</p>
              <p className="mt-1 text-sm text-gray-600">Gigs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-600">80+</p>
              <p className="mt-1 text-sm text-gray-600">Skills Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-600">₹0</p>
              <p className="mt-1 text-sm text-gray-600">Platform Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative text-center">
              <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-brand-600/25">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Post or Find a Gig</h3>
              <p className="text-gray-600 text-sm">Employers post gigs with budgets. Freelancers browse and search using AI-powered filters.</p>
            </div>
            <div className="relative text-center">
              <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-brand-600/25">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Matches You</h3>
              <p className="text-gray-600 text-sm">Our AI analyzes skills, experience, and project needs to find the best matches with confidence scores.</p>
            </div>
            <div className="relative text-center">
              <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-brand-600/25">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Work & Get Paid</h3>
              <p className="text-gray-600 text-sm">Deliver milestones, get approved, and receive payment. Track everything with auto-generated invoices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why BaseedWork?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Built for Indian freelancers and businesses. No hidden fees, no middlemen — just pure talent matching.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl p-6 border border-brand-100">
              <div className="w-12 h-12 bg-brand-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("features.aiMatching")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("features.aiMatchingDesc")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("features.securePayments")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("features.securePaymentsDesc")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("features.verifiedTalent")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("features.verifiedTalentDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vernacular Support */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Available in 5 Languages</h2>
          <p className="text-brand-100 mb-8 max-w-xl mx-auto">Use BaseedWork in your preferred language — English, Hindi, Tamil, Telugu, or Bengali.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা"].map((lang) => (
              <span key={lang} className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Join thousands of Indian freelancers and businesses already using BaseedWork. It&apos;s completely free.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3.5 text-base font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all hover:shadow-xl"
            >
              Create Free Account
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link
              href="/gigs"
              className="inline-flex items-center px-8 py-3.5 text-base font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-300 transition-all"
            >
              Browse Gigs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/gigs" className="hover:text-brand-600">Browse Gigs</Link></li>
                <li><Link href="/signup" className="hover:text-brand-600">Post a Gig</Link></li>
                <li><Link href="/signup" className="hover:text-brand-600">Find Freelancers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Web Development</li>
                <li>Mobile Apps</li>
                <li>Design & Creative</li>
                <li>Data & AI</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Trust & Safety</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 {tc("appName")}. All rights reserved.</p>
            <p className="text-sm text-gray-500">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
