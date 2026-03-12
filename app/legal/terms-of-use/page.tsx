import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'BlackArrow Insurance terms of service — the rules and guidelines governing your use of our website and services.',
}

export default function TermsOfUsePage() {
  return (
    <>
      <section className="bg-gradient-hero relative overflow-hidden pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container-narrow relative">
          <h1 className="text-white text-3xl sm:text-4xl">Terms of Service</h1>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-narrow prose-premium">
          <h2>Use of the Website</h2>
          <p>By accessing or using the website, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use the website. BlackArrow Insurance reserves the right to modify these terms at any time without prior notice.</p>

          <h2>Services</h2>
          <p>Our platform facilitates online insurance quote requests and policy management. All insurance policies are subject to the terms and conditions of the individual policy and may not be available in all states.</p>

          <h2>Text Messaging</h2>
          <p>Users may opt into SMS communications covering appointment reminders, order alerts, account notifications, and promotional updates. Message frequency varies based on subscription type. Standard carrier message and data rates apply. You can opt out at any time by texting &quot;STOP&quot; and will receive confirmation before messages cease.</p>

          <h2>User Content</h2>
          <p>You remain solely responsible for all information and content you submit through our website. BlackArrow Insurance does not assume any liability for user-submitted content. You warrant that you possess all necessary rights to any submissions you make.</p>

          <h2>User Conduct</h2>
          <p>You agree to use our website only for lawful purposes and in a manner that does not infringe upon the rights of others. Any activities that damage, disable, or impair the website are strictly prohibited.</p>

          <h2>Disclaimer of Warranties</h2>
          <p>Our services are provided &quot;as is&quot; and &quot;as available&quot; without any warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>

          <h2>Limitation of Liability</h2>
          <p>BlackArrow Insurance shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the website or services.</p>

          <h2>Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless BlackArrow Insurance and its affiliates from any third-party claims, damages, or expenses arising from your use of the website or violation of these Terms.</p>

          <h2>Governing Law</h2>
          <p>These Terms of Service are governed by and construed in accordance with the laws of the United States and the State of North Carolina, without regard to conflict of law principles.</p>

          <h2>Entire Agreement</h2>
          <p>These Terms constitute the entire agreement between you and BlackArrow Insurance regarding the use of our website and supersede all prior agreements and understandings.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about these Terms of Service, please contact us at <a href="mailto:admin@blackarrowfg.com">admin@blackarrowfg.com</a>.</p>
        </div>
      </section>
    </>
  )
}
