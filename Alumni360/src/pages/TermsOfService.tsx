import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using Alumni360, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. These terms apply to all users, including alumni, students, faculty, institutions, and administrators.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Account Registration</h2>
            <p>To use Alumni360, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 16 years of age</li>
            </ul>
            <p className="mt-3">You are responsible for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use the platform for unlawful purposes</li>
              <li>Share false or misleading information</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Use automated tools to scrape or collect data without permission</li>
              <li>Post spam, promotional content, or malware</li>
              <li>Impersonate other users or entities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. User Content</h2>
            <p>You retain ownership of content you create on Alumni360. By posting content, you grant us a non-exclusive, worldwide license to display, distribute, and use your content in connection with operating the platform. You are responsible for ensuring your content does not violate any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Institutional Partnerships</h2>
            <p>Educational institutions using Alumni360 agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use alumni data only for legitimate engagement purposes</li>
              <li>Comply with applicable data protection regulations</li>
              <li>Not sell or redistribute alumni personal data</li>
              <li>Maintain appropriate data security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
            <p>Alumni360's branding, design, code, and features are protected by intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the platform without written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time through the Settings page. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
            <p>Alumni360 is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability is limited to the amount you paid for the service in the preceding 12 months.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify users of material changes via email or platform notification. Continued use of Alumni360 after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact</h2>
            <p>For questions about these terms, contact us at:</p>
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

export default TermsOfService;
