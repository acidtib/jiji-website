import { LegalLayout } from '@/components/shared/LegalLayout'

const title = 'Terms of Service'
const description = 'Terms of Service for the Jiji website, documentation, and open-source software.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title,
    description,
    url: '/terms',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function TermsPage() {
  return (
    <LegalLayout>
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: August 10, 2026</p>

      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the Jiji website, documentation, and related
        services at <strong>jiji.run</strong> (collectively, the &quot;Site&quot;) and the Jiji open-source software
        (the &quot;Software&quot;).
      </p>
      <p>
        Jiji is an open-source project published at{' '}
        <a href="https://github.com/acidtib/jiji" target="_blank" rel="noreferrer">github.com/acidtib/jiji</a>{' '}
        (&quot;Jiji,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). There is no separate company or
        hosted service operating behind these Terms - references to &quot;we&quot; mean the Jiji project maintainers.
      </p>
      <p>
        By accessing the Site or using the Software, you agree to these Terms. If you do not agree to these Terms,
        do not use the Site or Software.
      </p>

      <h2>1. About Jiji</h2>
      <p>
        Jiji is open-source infrastructure software for deploying and managing containerized applications across
        Linux servers that you control.
      </p>
      <p>
        Jiji is designed to operate against infrastructure provided and controlled by you. Depending on your
        configuration, Jiji may connect to your servers over SSH, configure container runtimes, establish private
        networking, configure service discovery, manage deployments, and interact with container registries and
        other infrastructure that you specify.
      </p>
      <p>
        Jiji is not a hosted infrastructure provider, cloud provider, or managed hosting service.
      </p>

      <h2>2. Open-Source Software</h2>
      <p>The Jiji Software is provided under the MIT License.</p>
      <p>
        Your use, modification, and redistribution of the Software are governed by the applicable license included
        with the Software source code.
      </p>
      <p>
        These Terms govern your use of the Site and any services operated by us separately from the Software. To
        the extent the MIT License conflicts with these Terms regarding your rights to the Software itself, the
        MIT License controls.
      </p>

      <h2>3. Your Infrastructure</h2>
      <p>
        You are responsible for the servers, cloud accounts, networks, domains, container registries, credentials,
        applications, data, and other infrastructure that you connect to Jiji.
      </p>
      <p>
        You represent that you have the legal authority and appropriate permissions to access and modify any
        infrastructure on which you use Jiji.
      </p>
      <p>You are solely responsible for:</p>
      <ul>
        <li>Maintaining your cloud and infrastructure accounts.</li>
        <li>Maintaining appropriate backups.</li>
        <li>Protecting SSH keys, passwords, tokens, and other credentials.</li>
        <li>Configuring access controls and permissions.</li>
        <li>Reviewing Jiji configuration before deploying it to production.</li>
        <li>Ensuring that your applications and workloads comply with applicable laws.</li>
        <li>Monitoring the security and availability of your infrastructure.</li>
        <li>Determining whether Jiji is appropriate for your particular environment.</li>
      </ul>
      <p>
        Jiji may execute commands on servers according to the configuration and operations you initiate. You are
        responsible for understanding and reviewing those operations before executing them.
      </p>

      <h2>4. Your Applications and Data</h2>
      <p>
        Jiji does not control the applications, containers, files, databases, secrets, logs, or other content that
        you deploy using the Software.
      </p>
      <p>
        You retain responsibility for all content and data that you deploy or make accessible through
        infrastructure managed by Jiji.
      </p>
      <p>
        You are responsible for ensuring that you have the necessary rights to use, process, store, and distribute
        such content and data.
      </p>

      <h2>5. Credentials and Secrets</h2>
      <p>
        Jiji may use credentials and secrets supplied through your configuration or environment, including SSH
        credentials, registry credentials, environment variables, and application secrets.
      </p>
      <p>You are responsible for protecting these credentials and for ensuring that they are appropriately scoped.</p>

      <h2>6. Third-Party Services</h2>
      <p>
        Jiji can integrate with third-party services and infrastructure, including cloud providers, container
        registries, DNS providers, certificate authorities, and other services.
      </p>
      <p>Your use of those services is governed by their respective terms and policies.</p>
      <p>
        We do not control and are not responsible for the availability, security, reliability, pricing, policies,
        or actions of third-party services.
      </p>

      <h2>7. Website and Documentation</h2>
      <p>The Site and documentation are provided to help you understand and use Jiji.</p>
      <p>
        We attempt to keep the documentation accurate and useful, but infrastructure software can change quickly.
        Documentation may not always reflect every version, configuration, operating system, cloud provider, or
        third-party environment.
      </p>
      <p>You should independently verify configuration and commands before using them in production environments.</p>

      <h2>8. Acceptable Use</h2>
      <p>You may use Jiji for lawful purposes and for infrastructure that you are authorized to access.</p>
      <p>You may not use the Site or Software to:</p>
      <ul>
        <li>Gain unauthorized access to systems or networks.</li>
        <li>Deploy or operate infrastructure that you do not have permission to control.</li>
        <li>Interfere with or disrupt systems, networks, or services.</li>
        <li>Distribute malware or other malicious software.</li>
        <li>Circumvent security controls without authorization.</li>
        <li>Violate applicable laws or regulations.</li>
        <li>Infringe the rights of others.</li>
      </ul>
      <p>
        Nothing in these Terms prohibits legitimate security research, testing, or administration performed with
        appropriate authorization.
      </p>

      <h2>9. No Warranty</h2>
      <p>
        THE SITE, DOCUMENTATION, AND SOFTWARE ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; TO THE
        MAXIMUM EXTENT PERMITTED BY LAW.
      </p>
      <p>
        WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AVAILABILITY, OR THAT THE SOFTWARE WILL BE ERROR-FREE OR
        UNINTERRUPTED.
      </p>
      <p>
        Jiji is infrastructure software. Deployments can fail, servers can become unavailable, networks can fail,
        configurations can be incorrect, and data can be lost.
      </p>
      <p>
        You are responsible for determining whether the Software is suitable for your environment and for
        maintaining appropriate backups and recovery procedures.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF DATA, PROFITS, REVENUE, BUSINESS,
        GOODWILL, OR SERVICE AVAILABILITY ARISING FROM OR RELATED TO YOUR USE OF THE SITE OR SOFTWARE.
      </p>
      <p>
        This includes, without limitation, damages resulting from failed deployments, configuration errors, server
        failures, networking failures, credential exposure, data loss, application downtime, or third-party
        infrastructure failures.
      </p>
      <p>Nothing in these Terms limits liability that cannot legally be limited under applicable law.</p>

      <h2>11. Changes</h2>
      <p>We may update these Terms from time to time.</p>
      <p>
        When we make changes, we will update the &quot;Last updated&quot; date on this page. Your continued use of
        the Site after updated Terms are posted constitutes acceptance of the revised Terms, to the extent
        permitted by applicable law.
      </p>
      <p>
        Changes to the Jiji Software itself are governed by the applicable open-source license and project release
        process.
      </p>

      <h2>12. Termination</h2>
      <p>You may stop using the Site and Software at any time.</p>
      <p>
        Because Jiji is open-source software, termination of these Terms does not revoke rights granted to you
        under the applicable open-source license.
      </p>
      <p>
        We may restrict or terminate your access to any separately operated services associated with the Site if
        you violate these Terms or where reasonably necessary to protect the Site, its users, or others.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the <strong>State of Colorado, United States</strong>, without
        regard to its conflict-of-law principles.
      </p>
      <p>
        Any disputes arising from these Terms or your use of the Site shall be resolved in the state or federal
        courts located in Colorado, unless applicable law requires otherwise.
      </p>

      <h2>14. Contact</h2>
      <p>If you have questions about these Terms, contact us at:</p>
      <p>
        <strong>Jiji</strong>
        <br />
        <a href="mailto:hello@jiji.run">hello@jiji.run</a>
        <br />
        <a href="https://github.com/acidtib/jiji" target="_blank" rel="noreferrer">github.com/acidtib/jiji</a>
      </p>

      <hr />

      <p>Jiji is open-source software. Nothing in these Terms changes the rights granted by the Jiji MIT License.</p>
    </LegalLayout>
  )
}
