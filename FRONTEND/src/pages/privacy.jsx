import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div onClick={()=>{window.location.href = '/'}} className="max-w-5xl mx-auto flex items-center space-x-3 px-4 py-4">
          {/* Doc icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-white"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  </svg>
                </div>
          {/* Gradient Text Logo */}
          <span className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold">
            NotesDaddy
          </span>
        </div>
      </header>

      {/* Main Content / Card */}
      <main className="max-w-5xl mx-auto mt-10 mb-16 p-8 bg-white rounded-lg shadow-lg text-gray-800">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-200 pb-2">
          Privacy Policy
        </h1>

        {/* 1. Introduction */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">1. Introduction</h2>
          <p>
            Welcome to NotesDaddy. We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit our website{' '}
            <strong className="font-semibold">www.notesdaddy.com</strong> and use
            our services.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            2. Information We Collect
          </h2>
          <p>We may collect and process the following types of information:</p>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>
              <strong>Personal Identification Information:</strong> Name, email
              address, phone number, etc.
            </li>
            <li>
              <strong>Account Credentials:</strong> Username and password.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how you interact with
              our platform, including access times, pages viewed, and the
              features used.
            </li>
          </ul>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            3. How We Use Your Information
          </h2>
          <p>We use the collected information for various purposes, including:</p>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>To provide, operate, and maintain our platform.</li>
            <li>To improve, personalize, and expand our services.</li>
            <li>To understand and analyze how you use our platform.</li>
            <li>To develop new products, services, features, and functionality.</li>
            <li>To process transactions and manage your subscriptions.</li>
            <li>
              To communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with updates
              and other information relating to the platform, and for marketing and
              promotional purposes.
            </li>
            <li>To send you emails.</li>
            <li>To find and prevent fraud.</li>
          </ul>
        </section>

        {/* 4. Sharing Your Information */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            4. Sharing Your Information
          </h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information
            to third parties. Your email address is stored securely and used solely
            for the purposes outlined in this policy.
          </p>
          <p>
            <strong>For Legal Reasons:</strong> We may disclose your information if
            required to do so by law or in response to valid requests by public
            authorities (e.g., a court or a government agency).
          </p>
          <p>
            <strong>Business Transfers:</strong> In connection with, or during
            negotiations of, any merger, sale of company assets, financing, or
            acquisition of all or a portion of our business to another company.
          </p>
        </section>

        {/* 5. Data Security */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, please be aware that
            no security measures are perfect or impenetrable, and no method of data
            transmission can be guaranteed against any interception or other type
            of misuse.
          </p>
        </section>

        {/* 6. Changes to This Privacy Policy */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            6. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes
            in our practices or for other operational, legal, or regulatory
            reasons. We will notify you of any significant changes by posting the
            new Privacy Policy on our website and updating the effective date.
          </p>
        </section>

        {/* 7. Contact Us */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">7. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our
            data practices, please contact us at:
          </p>
          <p className="font-semibold">
            Email: <a href="mailto:info@notesdaddy.com">info@notesdaddy.com</a>
          </p>
        </section>

        {/* Acknowledgement */}
        <section className="pt-4 border-t border-gray-200">
          <p>
            By using NotesDaddy, you acknowledge that you have read and understood
            this Privacy Policy and agree to its terms.
          </p>
        </section>
      </main>
    </div>
  );
}
