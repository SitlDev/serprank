import React from 'react'
import { Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Security Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: April 20, 2026</p>

        <div className="grid md:grid-cols-4 gap-4 mb-12 py-8">
          <div className="text-center">
            <Lock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">End-to-End Encryption</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">SOC 2 Compliant</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Regular Audits</p>
          </div>
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">24/7 Monitoring</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2>1. Security Overview</h2>
          <p>
            Knotstranded LLC takes security seriously. SERPRank is built with security-first principles and follows industry best practices to protect your data. We are committed to maintaining the confidentiality, integrity, and availability of your information.
          </p>

          <h2>2. Infrastructure Security</h2>
          <h3>2.1 Data Centers</h3>
          <ul>
            <li>Hosted on AWS with enterprise-grade security</li>
            <li>Multiple availability zones for redundancy</li>
            <li>Physically secure data centers with biometric access</li>
            <li>24/7 surveillance and monitoring</li>
            <li>Backup power systems (UPS and generators)</li>
          </ul>

          <h3>2.2 Network Security</h3>
          <ul>
            <li>DDoS protection via AWS Shield</li>
            <li>Web Application Firewall (WAF)</li>
            <li>VPC (Virtual Private Cloud) isolation</li>
            <li>VPN for administrative access</li>
            <li>Intrusion detection and prevention systems</li>
            <li>Network segmentation and isolation</li>
          </ul>

          <h3>2.3 Server Security</h3>
          <ul>
            <li>Automated vulnerability scanning</li>
            <li>Regular security patches and updates</li>
            <li>Minimal attack surface (only necessary ports open)</li>
            <li>Host-based intrusion detection</li>
            <li>File integrity monitoring</li>
          </ul>

          <h2>3. Encryption</h2>
          <h3>3.1 Data in Transit</h3>
          <ul>
            <li>TLS 1.2+ for all HTTPS connections</li>
            <li>Perfect Forward Secrecy (PFS) enabled</li>
            <li>HSTS (HTTP Strict Transport Security) headers</li>
            <li>Encrypted API communications</li>
          </ul>

          <h3>3.2 Data at Rest</h3>
          <ul>
            <li>AES-256 encryption for database</li>
            <li>Encrypted backups with separate keys</li>
            <li>Encrypted file storage</li>
            <li>Key management via AWS KMS</li>
          </ul>

          <h3>3.3 Password Security</h3>
          <ul>
            <li>bcryptjs for password hashing</li>
            <li>Salted hashes with 10+ rounds</li>
            <li>Passwords never transmitted in plain text</li>
            <li>Password reset tokens expire after 1 hour</li>
          </ul>

          <h2>4. Access Control</h2>
          <h3>4.1 Authentication</h3>
          <ul>
            <li>Secure login with email/password</li>
            <li>JWT tokens with 7-day expiration</li>
            <li>Automatic logout after 30 minutes of inactivity</li>
            <li>Rate limiting on login attempts</li>
            <li>Account lockout after 5 failed attempts</li>
          </ul>

          <h3>4.2 Authorization</h3>
          <ul>
            <li>Role-based access control (RBAC)</li>
            <li>Principle of least privilege</li>
            <li>Audit logs for all access</li>
            <li>API key rotation every 90 days</li>
            <li>Separate keys for development/production</li>
          </ul>

          <h3>4.3 Admin Access</h3>
          <ul>
            <li>Multi-factor authentication (MFA) required</li>
            <li>All admin actions logged and auditable</li>
            <li>Time-limited administrative sessions</li>
            <li>Segregation of duties</li>
            <li>Regular access reviews</li>
          </ul>

          <h2>5. Application Security</h2>
          <h3>5.1 Secure Development</h3>
          <ul>
            <li>Security code reviews for all changes</li>
            <li>Static analysis with SonarQube</li>
            <li>Dynamic testing and penetration testing</li>
            <li>Dependency vulnerability scanning</li>
            <li>OWASP Top 10 compliance</li>
          </ul>

          <h3>5.2 Attack Prevention</h3>
          <ul>
            <li>SQL injection protection (parameterized queries)</li>
            <li>XSS (Cross-Site Scripting) prevention</li>
            <li>CSRF (Cross-Site Request Forgery) tokens</li>
            <li>Input validation and sanitization</li>
            <li>Rate limiting on API endpoints</li>
            <li>Content Security Policy (CSP)</li>
          </ul>

          <h2>6. Data Protection</h2>
          <h3>6.1 Backup and Disaster Recovery</h3>
          <ul>
            <li>Automated daily backups</li>
            <li>Backup retention for 30 days</li>
            <li>Encrypted backups in separate regions</li>
            <li>Recovery Time Objective (RTO): 4 hours</li>
            <li>Recovery Point Objective (RPO): 1 hour</li>
            <li>Annual disaster recovery drills</li>
          </ul>

          <h3>6.2 Data Deletion</h3>
          <ul>
            <li>Secure deletion using cryptographic erasure</li>
            <li>Data overwriting before disk reuse</li>
            <li>Immediate deletion on account closure</li>
            <li>Verification of deletion</li>
          </ul>

          <h2>7. Compliance</h2>
          <p>
            SERPRank complies with major security and privacy standards:
          </p>
          <ul>
            <li><strong>SOC 2 Type II:</strong> Verified compliance with security, availability, and integrity principles</li>
            <li><strong>GDPR:</strong> Full compliance with EU data protection regulations</li>
            <li><strong>CCPA:</strong> Compliant with California Consumer Privacy Act</li>
            <li><strong>HIPAA:</strong> Business Associate Agreement available upon request</li>
            <li><strong>PCI DSS:</strong> Payment Card Industry compliance</li>
            <li><strong>NIST:</strong> Aligned with NIST Cybersecurity Framework</li>
          </ul>

          <h2>8. Monitoring and Logging</h2>
          <h3>8.1 Security Monitoring</h3>
          <ul>
            <li>24/7 security operations center (SOC) monitoring</li>
            <li>Real-time alerting for suspicious activity</li>
            <li>Automated threat detection</li>
            <li>Log aggregation and analysis</li>
            <li>Network traffic monitoring</li>
          </ul>

          <h3>8.2 Audit Logging</h3>
          <ul>
            <li>All user actions logged with timestamp</li>
            <li>Admin actions logged separately</li>
            <li>API request logging</li>
            <li>Login/logout events tracked</li>
            <li>Logs retained for 90 days minimum</li>
            <li>Immutable log storage</li>
          </ul>

          <h2>9. Incident Response</h2>
          <h3>9.1 Incident Management</h3>
          <ul>
            <li>Written incident response plan</li>
            <li>Incident response team on call 24/7</li>
            <li>Incident severity classification</li>
            <li>Response time SLA based on severity</li>
            <li>Post-incident review process</li>
          </ul>

          <h3>9.2 Breach Notification</h3>
          <ul>
            <li>User notification within 24 hours of confirmed breach</li>
            <li>Detailed breach information provided</li>
            <li>Free credit monitoring offered</li>
            <li>Regulatory notification as required</li>
            <li>Transparency in communication</li>
          </ul>

          <h2>10. Third-Party Security</h2>
          <h3>10.1 Vendor Management</h3>
          <ul>
            <li>Security assessment of all vendors</li>
            <li>Written agreements with security requirements</li>
            <li>Regular vendor audits</li>
            <li>Vendor incident notification requirements</li>
            <li>Right to audit vendor practices</li>
          </ul>

          <h3>10.2 Current Third Parties</h3>
          <ul>
            <li><strong>AWS:</strong> Cloud infrastructure (SOC 2 compliant)</li>
            <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
            <li><strong>SendGrid:</strong> Email delivery (SOC 2 compliant)</li>
            <li><strong>Auth0:</strong> Authentication services (ISO 27001 certified)</li>
          </ul>

          <h2>11. Security Testing</h2>
          <h3>11.1 Regular Testing</h3>
          <ul>
            <li>Penetration testing annually</li>
            <li>Vulnerability assessments quarterly</li>
            <li>Security code reviews on all commits</li>
            <li>Dependency scanning weekly</li>
            <li>Automated security testing in CI/CD</li>
          </ul>

          <h3>11.2 External Audits</h3>
          <ul>
            <li>Annual SOC 2 audit</li>
            <li>Third-party penetration testing</li>
            <li>Regular security assessments</li>
            <li>Vulnerability disclosure program</li>
          </ul>

          <h2>12. Employee Security</h2>
          <ul>
            <li>Background checks for all employees</li>
            <li>Security awareness training required</li>
            <li>Confidentiality agreements (NDAs)</li>
            <li>Principle of least privilege for access</li>
            <li>Regular security drills</li>
            <li>Phishing simulation testing</li>
          </ul>

          <h2>13. Vulnerability Disclosure</h2>
          <p>
            If you discover a security vulnerability, please email security@serprank.io instead of publicly disclosing it. Please provide:
          </p>
          <ul>
            <li>Detailed description of vulnerability</li>
            <li>Steps to reproduce</li>
            <li>Potential impact</li>
            <li>Proposed fix (optional)</li>
          </ul>
          <p>
            We will acknowledge receipt within 24 hours and provide updates on our progress. We ask for 90 days before public disclosure to allow time for patching.
          </p>

          <h2>14. Security Updates</h2>
          <p>
            We release security updates as needed:
          </p>
          <ul>
            <li>Critical patches deployed within 24 hours</li>
            <li>High priority patches within 7 days</li>
            <li>Medium priority patches within 30 days</li>
            <li>Low priority patches in regular releases</li>
            <li>Zero-downtime deployments when possible</li>
          </ul>

          <h2>15. Contact Information</h2>
          <p>
            For security questions or concerns:
          </p>
          <ul>
            <li>Email: security@serprank.io</li>
            <li>Phone: +1-555-SERP-RANK (Mon-Fri, 9 AM - 6 PM EST)</li>
            <li>Address: Knotstranded LLC, USA</li>
          </ul>

          <h2>16. Acknowledgments</h2>
          <p>
            We appreciate the security research community's efforts in helping us maintain a secure platform. Security researchers who report vulnerabilities responsibly will be acknowledged unless they request anonymity.
          </p>
        </div>
      </div>
    </div>
  )
}
