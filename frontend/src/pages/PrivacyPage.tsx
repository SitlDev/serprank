import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: April 20, 2026</p>

        <div className="prose prose-slate max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Knotstranded LLC ("Company", "we", "us", or "our") operates SERPRank. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our Service.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect information in various ways:
          </p>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>Account registration (email, name, company)</li>
            <li>Payment information (processed securely via Stripe)</li>
            <li>Customer support communications</li>
            <li>Feedback, surveys, and support requests</li>
          </ul>
          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information (device type, OS, browser)</li>
            <li>Usage information (features used, analysis history, searches)</li>
            <li>Cookies and tracking pixels</li>
            <li>Location data (approximate, from IP address)</li>
          </ul>
          <h3>2.3 Third-Party Information</h3>
          <ul>
            <li>Data from payment processors</li>
            <li>Analytics providers (Google Analytics)</li>
            <li>Public SERP data and trending information</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide and improve our Service</li>
            <li>Process subscriptions and payments</li>
            <li>Send transactional emails (receipts, confirmations)</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Provide customer support</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
            <li>Analyze usage and improve user experience</li>
            <li>Conduct research and analytics</li>
          </ul>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell or rent your personal information. We may share information in these circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Third parties who process data on our behalf (payment processors, hosting, analytics)</li>
            <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            <li><strong>Your Consent:</strong> When you explicitly consent to sharing</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement comprehensive security measures to protect your information:
          </p>
          <ul>
            <li>SSL/TLS encryption for data in transit</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Secure password hashing (bcryptjs)</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Firewalls and intrusion detection</li>
          </ul>

          <h2>6. Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have the following rights:
          </p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data</li>
            <li><strong>Portability:</strong> Request export of your data</li>
            <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
            <li><strong>Cookie Control:</strong> Manage cookie preferences</li>
          </ul>

          <h2>7. Cookies and Tracking</h2>
          <p>
            SERPRank uses cookies for:
          </p>
          <ul>
            <li>Authentication and session management</li>
            <li>User preferences and settings</li>
            <li>Analytics and usage tracking</li>
            <li>Performance monitoring</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            SERPRank may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing personal information.
          </p>

          <h2>9. Data Retention</h2>
          <p>
            We retain personal information as long as necessary to provide our Service, comply with legal obligations, and resolve disputes. You can request deletion at any time, subject to legal and operational requirements.
          </p>
          <ul>
            <li>Active user data: Retained while account is active</li>
            <li>Inactive accounts: Retained for 12 months, then deleted</li>
            <li>Logs and analytics: Retained for 90 days</li>
            <li>Backups: Retained for 30 days</li>
          </ul>

          <h2>10. Children's Privacy</h2>
          <p>
            SERPRank is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will promptly delete it.
          </p>

          <h2>11. GDPR Compliance (EU Users)</h2>
          <p>
            If you are in the EU, you have additional rights under GDPR:
          </p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
            <li>Rights related to automated decision-making</li>
          </ul>
          <p>
            Our legal basis for processing includes: consent, contract performance, legal obligations, and legitimate interests.
          </p>

          <h2>12. CCPA Compliance (California Users)</h2>
          <p>
            If you are a California resident, you have rights under CCPA:
          </p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to delete personal information</li>
            <li>Right to opt-out of selling or sharing information</li>
            <li>Right to non-discrimination for exercising CCPA rights</li>
          </ul>

          <h2>13. Contact Information</h2>
          <p>
            For privacy-related questions or to exercise your rights, contact:
          </p>
          <ul>
            <li>Email: privacy@serprank.io</li>
            <li>Mail: Knotstranded LLC, USA</li>
            <li>Phone: +1-555-SERP-RANK (Mon-Fri, 9 AM - 6 PM EST)</li>
          </ul>

          <h2>14. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our practices. We will notify you of material changes via email or by posting the updated policy on our website. Your continued use of the Service constitutes your acceptance of the updated Privacy Policy.
          </p>

          <h2>15. California Privacy Rights</h2>
          <p>
            California residents have the right to request information about the categories of personal information we share with third parties for their direct marketing purposes. To make such a request, please contact us at privacy@serprank.io.
          </p>
        </div>
      </div>
    </div>
  )
}
