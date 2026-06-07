import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>Alumni360 collects information you provide directly, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Account Information:</strong> Name, email address, phone number, institution, role, and batch year when you create an account.</li>
              <li><strong className="text-foreground">Profile Data:</strong> Professional information, skills, career history, and profile photos you choose to share.</li>
              <li><strong className="text-foreground">Communications:</strong> Messages, posts, comments, and other content you create on the platform.</li>
              <li><strong className="text-foreground">Contact Form Submissions:</strong> Information submitted through our partnership and contact forms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide, maintain, and improve Alumni360 services</li>
              <li>Facilitate connections between alumni, students, faculty, and institutions</li>
              <li>Send notifications about platform activity, events, and opportunities</li>
              <li>Process partnership and demo requests</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Generate anonymized analytics for institutional partners</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing & Disclosure</h2>
            <p>We do not sell your personal data. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Educational Institutions:</strong> Aggregated, anonymized data for alumni engagement analytics.</li>
              <li><strong className="text-foreground">Service Providers:</strong> Third-party services that help us operate the platform (hosting, email delivery, analytics).</li>
              <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS/SSL), encrypted data at rest, regular security audits, and access controls. While we strive to protect your data, no method of electronic transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Access and download your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Restrict or object to certain data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies & Tracking</h2>
            <p>We use essential cookies for authentication and session management. We do not use third-party advertising cookies. Analytics cookies are used in anonymized form to improve the platform experience.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at:</p>
            <p className="mt-2">
              <strong className="text-foreground">Email:</strong>{" "}
              <a href="mailto:connect.alumni360@gmail.com" className="text-primary hover:underline">
                connect.alumni360@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
