import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'BlackArrow Insurance privacy policy — how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-gradient-hero relative overflow-hidden pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container-narrow relative">
          <h1 className="text-white text-3xl sm:text-4xl">Privacy Policy</h1>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-narrow prose-premium">
          <p>Black Arrow Financial Group (&quot;BlackArrow Insurance,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy of our customers and website visitors. This Privacy Policy outlines how we collect, use, and disclose personal information through our website and services.</p>

          <h2>Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us, including but not limited to:</p>
          <ul>
            <li>Names, addresses, phone numbers, and email addresses</li>
            <li>Information regarding your insurance needs and preferences</li>
            <li>Website usage data such as the pages you visit and the actions you take</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>Providing insurance quotes and processing applications</li>
            <li>Servicing your insurance policies</li>
            <li>Communicating with you about your coverage</li>
            <li>Conducting marketing, research, and analysis to improve our services</li>
          </ul>

          <h2>Text Messaging Consent and Privacy</h2>
          <p>If you opt in to receive text messages from BlackArrow Insurance, your opt-in data and consent will not be shared, sold, or transferred to any third parties under any circumstances. We maintain strict privacy compliance with all text messaging communications.</p>

          <h2>Disclosure of Information</h2>
          <p>We may disclose your personal information in the following situations:</p>
          <ul>
            <li>When required by law or legal process</li>
            <li>When necessary to protect our rights, safety, or property</li>
            <li>With third-party service providers who assist us in delivering requested services</li>
          </ul>

          <h2>Security of Information</h2>
          <p>We take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>Links to Other Websites</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external websites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

          <h2>Children&apos;s Privacy</h2>
          <p>Our website is not designed for or directed at users under the age of 18. We do not knowingly collect personal information from minors.</p>

          <h2>Changes to This Policy</h2>
          <p>We reserve the right to update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:admin@blackarrowfg.com">admin@blackarrowfg.com</a>.</p>
        </div>
      </section>
    </>
  )
}
