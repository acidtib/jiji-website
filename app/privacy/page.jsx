import { LegalLayout } from '@/components/shared/LegalLayout'

const title = 'Privacy Policy'
const description = 'Privacy Policy for the Jiji website, documentation, and open-source software.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title,
    description,
    url: '/privacy',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: August 10, 2026</p>

      <p>
        This Privacy Policy explains how the Jiji project maintainers (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) handle information in connection with the Jiji website, documentation, and related
        services at <strong>jiji.run</strong> (the &quot;Site&quot;), and the Jiji open-source software (the
        &quot;Software&quot;). Jiji is published at{' '}
        <a href="https://github.com/acidtib/jiji" target="_blank" rel="noreferrer">github.com/acidtib/jiji</a>{' '}
        and there is no separate company operating behind this policy.
      </p>
      <p>
        We designed Jiji so that the core Software operates against infrastructure controlled by you rather than
        requiring you to send your infrastructure data to us.
      </p>

      <h2>1. Information We Collect</h2>

      <p><strong>Information you provide</strong></p>
      <p>We may receive information that you voluntarily provide to us, such as when you:</p>
      <ul>
        <li>Contact us by email.</li>
        <li>Open or participate in an issue, discussion, or pull request on GitHub.</li>
        <li>Participate in the Jiji community.</li>
        <li>Report a bug or security issue.</li>
        <li>Otherwise communicate with us.</li>
      </ul>
      <p>
        The information you provide may include your name, email address, GitHub username, message content, and
        any other information you choose to provide.
      </p>

      <p><strong>Information collected by the website</strong></p>
      <p>
        When you visit the Site, our hosting and infrastructure providers may automatically process technical
        information associated with your request, such as:
      </p>
      <ul>
        <li>IP address.</li>
        <li>Browser and device information.</li>
        <li>Requested pages and resources.</li>
        <li>Date and time of requests.</li>
        <li>Referrer information.</li>
        <li>Basic network and security information.</li>
      </ul>
      <p>
        This information may be processed for purposes such as delivering the Site, preventing abuse, maintaining
        security, diagnosing technical problems, and keeping the Site available.
      </p>

      <p><strong>Cookies and similar technologies</strong></p>
      <p>
        The Site does not use analytics, tracking, or advertising cookies. We do not run any analytics service (for
        example, Google Analytics or similar tools) on the Site, and the Site does not set cookies to identify or
        track visitors across sessions.
      </p>
      <p>We do not use cookies to collect information from Jiji deployments or to monitor the contents of your infrastructure.</p>

      <h2>2. Information Jiji Does Not Collect Through the Software</h2>
      <p>The Jiji Software is designed to run on your machine and communicate with infrastructure that you configure.</p>
      <p>
        We do not operate a central Jiji control plane that receives your deployment configuration, container
        contents, application data, server data, or secrets as part of normal Jiji operation.
      </p>
      <p>In particular, the Jiji Software does not inherently require us to receive:</p>
      <ul>
        <li>Your application source code.</li>
        <li>Container images.</li>
        <li>Container contents.</li>
        <li>Environment variables.</li>
        <li>Application secrets.</li>
        <li>SSH private keys.</li>
        <li>Server files.</li>
        <li>Database contents.</li>
        <li>Application logs.</li>
        <li>Deployment configuration.</li>
        <li>Server credentials.</li>
      </ul>
      <p>
        Jiji may transmit information directly between your computer and infrastructure you configure. Those
        communications are not communications with us.
      </p>

      <h2>3. Third-Party Services</h2>
      <p>
        Jiji may interact with third-party services that you configure or use, including cloud providers, container
        registries, DNS services, certificate authorities, GitHub, and other infrastructure providers.
      </p>
      <p>Those providers may collect and process information according to their own privacy policies.</p>
      <p>
        For example, when you configure Jiji to use a third-party container registry, communications with that
        registry occur according to your configuration and the registry&apos;s own services and policies.
      </p>
      <p>We do not control the privacy practices of third-party services.</p>

      <h2>4. GitHub and Community Contributions</h2>
      <p>Jiji&apos;s source code is hosted on GitHub.</p>
      <p>
        If you submit an issue, pull request, discussion, or other public contribution to the Jiji project, the
        information you submit may be publicly visible and processed by GitHub according to GitHub&apos;s own
        policies.
      </p>
      <p>
        Do not submit secrets, credentials, private keys, personal information, or other confidential information
        in public project discussions or issues.
      </p>

      <h2>5. How We Use Information</h2>
      <p>Information we receive may be used to:</p>
      <ul>
        <li>Respond to questions and support requests.</li>
        <li>Maintain and improve the Site.</li>
        <li>Maintain and improve Jiji.</li>
        <li>Investigate bugs and security issues.</li>
        <li>Prevent abuse and protect the Site.</li>
        <li>Communicate important project information.</li>
        <li>Comply with legal obligations.</li>
        <li>Protect our rights and the rights of others.</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>6. Data Retention</h2>
      <p>
        We retain information only for as long as reasonably necessary for the purposes described in this Privacy
        Policy, unless a longer period is required by law.
      </p>
      <p>
        Information contained in public GitHub issues, pull requests, discussions, or other public contributions
        may remain available according to GitHub&apos;s operation of those services.
      </p>

      <h2>7. Data Security</h2>
      <p>We use reasonable administrative, technical, and organizational measures to protect information we receive.</p>
      <p>However, no system or transmission over the Internet can be guaranteed to be completely secure.</p>
      <p>
        Because Jiji operates on infrastructure controlled by its users, you are responsible for securing your own
        systems, credentials, servers, networks, and applications.
      </p>

      <h2>8. Your Privacy Rights</h2>
      <p>
        Depending on where you live, you may have rights regarding your personal information, including rights to
        request access to, correction of, or deletion of certain information.
      </p>
      <p>To make a privacy request, contact us using the information below.</p>
      <p>We may need to verify your identity before fulfilling certain requests.</p>
      <p>Nothing in this Privacy Policy limits rights that cannot legally be limited under applicable law.</p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>The Site and Software are not directed toward children under the age of 13.</p>
      <p>We do not knowingly collect personal information from children under 13.</p>
      <p>
        If you believe that a child has provided us with personal information, please contact us so that we can
        take appropriate action.
      </p>

      <h2>10. International Visitors</h2>
      <p>
        The Site may be accessed from countries around the world. Depending on where you live and where our service
        providers operate, information may be processed in countries other than your own.
      </p>
      <p>
        By using the Site, you acknowledge that information may be processed in jurisdictions with different data
        protection laws, subject to applicable legal requirements.
      </p>

      <h2>11. Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time.</p>
      <p>When we make changes, we will update the &quot;Last updated&quot; date at the top of this page.</p>
      <p>For material changes, we may provide additional notice where required by applicable law.</p>

      <h2>12. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or want to make a privacy-related request, contact:</p>
      <p>
        <strong>Jiji</strong>
        <br />
        <a href="mailto:hello@jiji.run">hello@jiji.run</a>
        <br />
        <a href="https://github.com/acidtib/jiji" target="_blank" rel="noreferrer">github.com/acidtib/jiji</a>
      </p>

      <hr />

      <p>
        This Privacy Policy applies to the Jiji Site and information we receive. It does not replace the privacy
        policies of cloud providers, registries, GitHub, or other third-party services that you independently use
        with Jiji.
      </p>
    </LegalLayout>
  )
}
