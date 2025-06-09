export default function Support() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--beer-amber)] mb-4">
            PongBros Support Center
          </h1>
          <p className="text-xl opacity-80">
            Get help with your beer pong companion app
          </p>
        </div>

        {/* Contact Us */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-4 flex items-center">
            📧 Contact Us
          </h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> support@pongbros.co.za</p>
            <p><strong>Response Time:</strong> 24-48 hours</p>
            <p><strong>Support Hours:</strong> Monday-Friday, 9AM-5PM SAST</p>
            <p><strong>Emergency Issues:</strong> Account security, billing problems</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🤔 Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How do I create an account?</h3>
              <p className="opacity-80">Download PongBros from the App Store, open the app, and tap &quot;Sign Up&quot;. You can register with your email address or sign in with Apple.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I add Beer Buddies (friends)?</h3>
              <p className="opacity-80">Go to Settings &gt; Beer Buddies &gt; Add Friend. Enter your friend&apos;s email address to send them a friend request.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I start a game?</h3>
              <p className="opacity-80">Tap &quot;New Game&quot; on the home screen, select players, choose your cup formation (6 or 10 cups), and start playing!</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Can I play offline?</h3>
              <p className="opacity-80">Yes! You can track games offline. Your stats will sync when you reconnect to the internet.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I book a table at a venue?</h3>
              <p className="opacity-80">Go to &quot;Venues&quot; tab, select a participating bar/venue, choose your preferred time slot, and book your table.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I join a tournament?</h3>
              <p className="opacity-80">Check the &quot;Tournaments&quot; tab for upcoming events, or create your own tournament and invite friends.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I reset my password?</h3>
              <p className="opacity-80">On the login screen, tap &quot;Forgot Password&quot; and enter your email. You&apos;ll receive a reset link within a few minutes.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Why can&apos;t I see my friend&apos;s game invite?</h3>
              <p className="opacity-80">Make sure both players have the latest app version and are connected to the internet. Check your notifications settings in iOS Settings &gt; PongBros.</p>
            </div>
          </div>
        </section>

        {/* Technical Support */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🔧 Technical Support
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">App won't open or crashes</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Force close the app and restart it</li>
                <li>Restart your iPhone/iPad</li>
                <li>Update to the latest version from App Store</li>
                <li>Check if iOS needs updating</li>
                <li>If problem persists, contact support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Login issues</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Check your internet connection</li>
                <li>Verify email and password are correct</li>
                <li>Try &quot;Forgot Password&quot; if needed</li>
                <li>Clear app cache by reinstalling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Friend requests not working</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Ensure both users have latest app version</li>
                <li>Check email address is spelled correctly</li>
                <li>Ask friend to check their pending requests</li>
                <li>Both users need internet connection</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Game stats not syncing</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Check internet connection</li>
                <li>Force close and reopen app</li>
                <li>Stats sync automatically when connected</li>
                <li>Contact support if data appears lost</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Camera/Photo issues</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Go to iOS Settings &gt; Privacy &amp; Security &gt; Camera</li>
                <li>Make sure PongBros has camera permission</li>
                <li>Restart the app after changing permissions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Account Management */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            👤 Account Management
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How do I change my profile picture?</h3>
              <p className="opacity-80">Go to Settings, tap your profile picture, and choose &quot;Take Photo&quot; or &quot;Choose from Library&quot;.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I change my username?</h3>
              <p className="opacity-80">Currently, usernames are set during registration. Contact support if you need to change yours.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I delete my account?</h3>
              <p className="opacity-80">Email support@pongbros.co.za with your request. We&apos;ll permanently delete your account and data within 30 days.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">How do I update my email address?</h3>
              <p className="opacity-80">Contact support to change your registered email address.</p>
            </div>
          </div>
        </section>

        {/* Game Features */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🏆 Game Features
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Cup Formations</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li><strong>6 Cups (3-2-1):</strong> Classic formation for casual games</li>
                <li><strong>10 Cups (4-3-2-1):</strong> Official tournament formation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Scoring Rules</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Make a cup = opponent removes it</li>
                <li>Ball bounce = extra shot opportunity</li>
                <li>Last cup rules apply automatically</li>
                <li>Stats tracked for all game modes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Tournament Features</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Create private tournaments for friends</li>
                <li>Join public tournaments in your area</li>
                <li>Bracket management handled automatically</li>
                <li>Prize tracking and winner announcements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Venue Integration */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🍺 Venue Integration
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to find participating venues</h3>
              <p className="opacity-80">Use the "Venues" tab to see bars and locations near you that support PongBros bookings.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Booking a table</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Select venue and preferred time slot</li>
                <li>Choose number of players (2-4)</li>
                <li>Confirm booking via the app</li>
                <li>Receive confirmation and table number</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Check-in process</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Arrive at venue during your time slot</li>
                <li>Use the app to check in at your table</li>
                <li>Start your game and track scores</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🔒 Privacy & Safety
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Data Collection</h3>
              <p className="opacity-80 mb-2">We collect minimal data needed for app functionality:</p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Account information (email, username)</li>
                <li>Game statistics and history</li>
                <li>Friend connections</li>
                <li>Profile photos (optional)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Data Security</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>All data encrypted in transit and at rest</li>
                <li>Regular security audits performed</li>
                <li>No data sold to third parties</li>
                <li>Firebase secure backend infrastructure</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Report Inappropriate Behavior</h3>
              <p className="opacity-80 mb-2">Email support@pongbros.co.za to report:</p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Offensive usernames or profile pictures</li>
                <li>Harassment from other users</li>
                <li>Inappropriate tournament names</li>
                <li>Any safety concerns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            📱 System Requirements
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Minimum Requirements</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>iOS 15.0 or later</li>
                <li>iPhone 8 or newer / iPad (6th generation) or newer</li>
                <li>100MB available storage</li>
                <li>Internet connection for social features</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Recommended</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>iOS 16.0 or later</li>
                <li>iPhone 12 or newer</li>
                <li>Stable WiFi or cellular connection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Requests */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🆕 Feature Requests
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Submit Ideas</h3>
              <p className="opacity-80 mb-2">We love hearing from our community! Email us at support@pongbros.co.za with:</p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Feature suggestions</li>
                <li>UI/UX improvements</li>
                <li>New game modes</li>
                <li>Venue partnership requests</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Apple Watch companion app</li>
                <li>Advanced tournament brackets</li>
                <li>Live streaming integration</li>
                <li>Enhanced venue features</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            📞 Emergency Support
          </h2>
          
          <div className="space-y-4">
            <p className="opacity-80">For urgent issues contact us immediately:</p>
            <ul className="list-disc list-inside opacity-80 space-y-1">
              <li>Account security breaches</li>
              <li>Billing/payment problems</li>
              <li>Inappropriate content reports</li>
            </ul>
            <div className="mt-4">
              <p><strong>Emergency Email:</strong> urgent@pongbros.co.za</p>
              <p><strong>Response Time:</strong> Within 4 hours</p>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-12 glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[var(--beer-amber)] mb-6 flex items-center">
            🔗 Additional Resources
          </h2>
          
          <div className="space-y-2">
            <p><strong>Privacy Policy:</strong> <a href="/privacy" className="text-[var(--beer-amber)] hover:underline">pongbros.co.za/privacy</a></p>
            <p><strong>Terms of Service:</strong> <a href="/terms" className="text-[var(--beer-amber)] hover:underline">pongbros.co.za/terms</a></p>
            <p><strong>Community Guidelines:</strong> <a href="/guidelines" className="text-[var(--beer-amber)] hover:underline">pongbros.co.za/guidelines</a></p>
            <p><strong>App Store:</strong> <a href="#" className="text-[var(--beer-amber)] hover:underline">Download PongBros</a></p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center opacity-60 border-t border-[var(--beer-amber)]/20 pt-6">
          <p><strong>Last Updated:</strong> December 2024</p>
          <p><strong>PongBros Version:</strong> 1.0.0</p>
        </footer>
      </div>
    </div>
  );
} 