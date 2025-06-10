export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--beer-amber)] mb-4">
            Privacy Policy for PongBros
          </h1>
          <p className="text-lg opacity-80">
            Last Updated: December 2024
          </p>
          <p className="text-lg opacity-80">
            Effective Date: December 2024
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4">
            Introduction
          </h2>
          <p className="opacity-80">
            Welcome to PongBros! This Privacy Policy explains how PongBros (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, and protects your information when you use our mobile application (the &quot;App&quot;). By using PongBros, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Information We Collect
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">1. Personal Information</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Email Address:</strong> Required for account creation and authentication</li>
                <li><strong>Username:</strong> Chosen during registration for identification within the app</li>
                <li><strong>Profile Photos:</strong> Optional photos you upload for your profile</li>
                <li><strong>Display Name:</strong> How you appear to other users</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">2. Game Data</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Game Statistics:</strong> Wins, losses, games played, sink rates, tournament performance</li>
                <li><strong>Game History:</strong> Records of matches played, scores, and participants</li>
                <li><strong>Friend Connections:</strong> Your beer buddy list and friend requests</li>
                <li><strong>Tournament Participation:</strong> Events you join or create</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">3. Venue &amp; Booking Information</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Table Reservations:</strong> Booking details, venue preferences, check-in times</li>
                <li><strong>Location Data:</strong> General location for finding nearby venues (with permission)</li>
                <li><strong>Payment Information:</strong> Processed securely through third-party payment processors</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">4. Technical Information</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Device Information:</strong> Device type, operating system version, app version</li>
                <li><strong>Usage Analytics:</strong> App interactions, features used, crash reports</li>
                <li><strong>Push Notification Tokens:</strong> For sending game invites and notifications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">5. Biometric Data</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Face ID/Touch ID:</strong> Used locally on your device for authentication (not stored on our servers)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            How We Use Your Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Core App Functionality</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Account Management:</strong> Create and maintain your PongBros account</li>
                <li><strong>Game Tracking:</strong> Record your beer pong statistics and match history</li>
                <li><strong>Social Features:</strong> Connect with friends, send game invites, manage buddy lists</li>
                <li><strong>Tournaments:</strong> Organize and participate in beer pong competitions</li>
                <li><strong>Venue Services:</strong> Book tables at participating bars and venues</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Communication</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Notifications:</strong> Send game invites, friend requests, tournament updates</li>
                <li><strong>Support:</strong> Respond to your questions and provide customer service</li>
                <li><strong>Updates:</strong> Inform you about new features and important app changes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Improvement &amp; Analytics</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>App Enhancement:</strong> Analyze usage patterns to improve features</li>
                <li><strong>Bug Fixes:</strong> Identify and resolve technical issues</li>
                <li><strong>Performance:</strong> Optimize app speed and reliability</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Information Sharing
          </h2>
          
          <p className="opacity-80 mb-4"><strong>We DO NOT sell your personal information to third parties.</strong></p>
          
          <p className="opacity-80 mb-4">We may share information with:</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Service Providers:</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Firebase (Google):</strong> Cloud storage, authentication, and real-time database</li>
                <li><strong>Payment Processors:</strong> Secure handling of booking transactions</li>
                <li><strong>Analytics Services:</strong> Anonymous usage statistics for app improvement</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Legal Requirements:</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>When required by law or legal process</li>
                <li>To protect the rights and safety of our users</li>
                <li>To prevent fraud or abuse of our services</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Business Transfers:</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Storage & Security */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Data Storage &amp; Security
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Security Measures</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Encryption:</strong> All data transmitted using industry-standard SSL/TLS encryption</li>
                <li><strong>Firebase Security:</strong> Google&apos;s enterprise-grade security infrastructure</li>
                <li><strong>Access Controls:</strong> Limited employee access on a need-to-know basis</li>
                <li><strong>Regular Audits:</strong> Periodic security assessments and updates</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Data Retention</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                <li><strong>Inactive Accounts:</strong> Data may be deleted after 2 years of inactivity</li>
                <li><strong>Game Statistics:</strong> Historical data retained for leaderboards and achievements</li>
                <li><strong>Legal Requirements:</strong> Some data retained longer if required by law</li>
              </ul>
            </div>
          </div>
        </section>

        {/* International Transfers */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4">
            International Transfers
          </h2>
          <p className="opacity-80">
            Your data may be processed in countries other than your own, including the United States where our servers are located. We ensure appropriate safeguards are in place.
          </p>
        </section>

        {/* Your Privacy Rights */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Your Privacy Rights
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Account Management</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Access:</strong> View your personal information and game statistics</li>
                <li><strong>Update:</strong> Modify your profile, username, and preferences</li>
                <li><strong>Delete:</strong> Request complete account deletion</li>
                <li><strong>Export:</strong> Download your game data and statistics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Communication Preferences</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Push Notifications:</strong> Enable/disable in app settings or device settings</li>
                <li><strong>Email Communications:</strong> Opt-out of promotional emails</li>
                <li><strong>Friend Requests:</strong> Control who can send you friend requests</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Data Rights (GDPR/CCPA)</h3>
              <p className="opacity-80 mb-2">If you&apos;re in the EU, California, or other applicable jurisdictions:</p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Right to Know:</strong> What personal information we collect and how it&apos;s used</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Correct:</strong> Update inaccurate personal information</li>
                <li><strong>Right to Portability:</strong> Receive a copy of your data in a portable format</li>
                <li><strong>Right to Opt-Out:</strong> Refuse certain data processing activities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Third-Party Services
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Firebase (Google)</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Purpose:</strong> Authentication, database, cloud storage</li>
                <li><strong>Data Shared:</strong> Email, username, game data, profile photos</li>
                <li><strong>Privacy Policy:</strong> Google Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Payment Processors</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Purpose:</strong> Secure payment processing for venue bookings</li>
                <li><strong>Data Shared:</strong> Payment information only (we don&apos;t store card details)</li>
                <li><strong>Security:</strong> PCI DSS compliant processors</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Analytics Services</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Purpose:</strong> App performance and usage analytics</li>
                <li><strong>Data Shared:</strong> Anonymous usage statistics only</li>
                <li><strong>No Personal Information:</strong> Analytics are aggregated and anonymized</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4">
            Children&apos;s Privacy
          </h2>
          <p className="opacity-80">
            PongBros is intended for users 17 years and older due to alcohol-related content. We do not knowingly collect information from children under 17. If we become aware that a child under 17 has provided us with personal information, we will take steps to delete such information.
          </p>
        </section>

        {/* Location Information */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Location Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Venue Discovery</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Permission-Based:</strong> Only with your explicit consent</li>
                <li><strong>Purpose:</strong> Find nearby participating bars and venues</li>
                <li><strong>Control:</strong> Can be disabled in app or device settings</li>
                <li><strong>Precision:</strong> General area only, not precise location tracking</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Push Notifications */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Push Notifications
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Types of Notifications</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Game Invites:</strong> When friends invite you to play</li>
                <li><strong>Friend Requests:</strong> New buddy requests</li>
                <li><strong>Tournament Updates:</strong> Event status and results</li>
                <li><strong>Booking Confirmations:</strong> Table reservation confirmations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Control</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Manage notification preferences in the app settings</li>
                <li>Disable completely through your device settings</li>
                <li>Choose specific notification types to receive</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Breach Notification */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4">
            Data Breach Notification
          </h2>
          <p className="opacity-80 mb-2">In the unlikely event of a data breach:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1">
            <li>We will investigate and assess the incident within 72 hours</li>
            <li>Affected users will be notified promptly via email</li>
            <li>Authorities will be notified as required by law</li>
            <li>We will provide details about what information was involved and steps being taken</li>
          </ul>
        </section>

        {/* Changes to This Privacy Policy */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4">
            Changes to This Privacy Policy
          </h2>
          <ul className="list-disc list-inside opacity-80 space-y-1">
            <li>We may update this Privacy Policy periodically</li>
            <li>Significant changes will be announced in the app</li>
            <li>Continued use constitutes acceptance of changes</li>
            <li>Previous versions available upon request</li>
          </ul>
        </section>

        {/* Contact Us */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Contact Us
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Privacy Questions</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>Email:</strong> privacy@pongbros.co.za</li>
                <li><strong>Support:</strong> support@pongbros.co.za</li>
                <li><strong>Response Time:</strong> 48-72 hours</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Data Protection Officer</h3>
              <p className="opacity-80 mb-2">For GDPR-related inquiries:</p>
              <p className="opacity-80"><strong>Email:</strong> dpo@pongbros.co.za</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Mailing Address</h3>
              <div className="opacity-80">
                <p>PongBros Privacy Team</p>
                <p>[Your Business Address]</p>
                <p>South Africa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Basis for Processing */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Legal Basis for Processing (GDPR)
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Legitimate Interests</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>App functionality and user experience</li>
                <li>Fraud prevention and security</li>
                <li>Analytics for service improvement</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Contractual Necessity</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Account management and authentication</li>
                <li>Game tracking and statistics</li>
                <li>Friend connections and social features</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Consent</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Marketing communications</li>
                <li>Location services for venue discovery</li>
                <li>Optional profile photos and data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Your Consent */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6">
            Your Consent
          </h2>
          
          <p className="opacity-80 mb-4">By using PongBros, you consent to:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1 mb-4">
            <li>Collection and use of information as described in this Privacy Policy</li>
            <li>Transfer of data to service providers as outlined above</li>
            <li>Processing of data for the purposes specified</li>
          </ul>
          
          <p className="opacity-80 mb-2">You may withdraw consent at any time by:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1">
            <li>Deleting your account</li>
            <li>Contacting our support team</li>
            <li>Adjusting privacy settings in the app</li>
          </ul>
        </section>

        {/* Compliance */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4">
            Compliance
          </h2>
          <p className="opacity-80 mb-2">This Privacy Policy complies with:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1">
            <li>GDPR (General Data Protection Regulation)</li>
            <li>CCPA (California Consumer Privacy Act)</li>
            <li>POPIA (Protection of Personal Information Act - South Africa)</li>
            <li>Apple App Store privacy requirements</li>
            <li>Google Play Store privacy requirements</li>
          </ul>
        </section>

        {/* Footer */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <p className="opacity-80 mb-4">
            This Privacy Policy was last updated on December 2024. We encourage you to review this policy periodically for any changes.
          </p>
          
          <div className="space-y-2">
            <p><strong>Download PongBros:</strong> [App Store Link]</p>
            <p><strong>Website:</strong> <a href="https://pongbros.co.za" className="text-[var(--beer-amber)] hover:underline">https://pongbros.co.za</a></p>
            <p><strong>Support:</strong> <a href="https://pongbros.co.za/support" className="text-[var(--beer-amber)] hover:underline">https://pongbros.co.za/support</a></p>
          </div>
        </section>
      </div>
    </div>
  );
} 