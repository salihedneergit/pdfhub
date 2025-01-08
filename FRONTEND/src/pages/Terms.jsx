import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center space-x-3 px-4 py-4">
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
          Terms and Conditions
        </h1>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using the NotesDaddy platform ("Service"), you
            agree to comply with and be bound by these Terms and Conditions
            ("Terms"). If you do not agree with these Terms, please do not use
            our Service.
          </p>
        </section>

        {/* 2. Description of Service */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            2. Description of Service
          </h2>
          <p>
            NotesDaddy provides an online platform for users to access
            educational materials, including notes and PDFs, and utilize study
            tools such as streak tracking, a Pomodoro timer, and a to-do list.
          </p>
        </section>

        {/* 3. User Accounts */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            3. User Accounts
          </h2>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>
              <strong>Registration:</strong> To access certain features, you
              must create an account using your Google credentials. You are
              responsible for maintaining the confidentiality of your account
              information.
            </li>
            <li>
              <strong>Account Termination:</strong> We reserve the right to
              suspend or terminate your account if you violate these Terms or
              engage in any activity that may harm the Service or its users.
            </li>
          </ul>
        </section>

        {/* 4. User Conduct */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            4. User Conduct
          </h2>
          <p>By using the Service, you agree not to:</p>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>Share your subscription or access with others.</li>
            <li>
              Attempt to gain unauthorized access to other users' accounts or
              our systems.
            </li>
            <li>
              Engage in any activity that disrupts or interferes with the
              Service.
            </li>
          </ul>
        </section>

        {/* 5. Intellectual Property */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            5. Intellectual Property
          </h2>
          <p>
            All content provided on NotesDaddy, including text, graphics, logos,
            and software, is the property of NotesDaddy or its content suppliers
            and is protected by intellectual property laws. Unauthorized use of
            any content is prohibited.
          </p>
        </section>

        {/* 6. Privacy Policy */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            6. Privacy Policy
          </h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which
            outlines how we collect, use, and protect your personal information.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            7. Limitation of Liability
          </h2>
          <p>
            NotesDaddy is not liable for any indirect, incidental, or
            consequential damages arising from your use of the Service. Our
            total liability to you for any claim arising out of or relating to
            these Terms or the Service is limited to the amount paid, if any, by
            you to us in the past six months.
          </p>
        </section>

        {/* 8. Modifications to Service and Terms */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            8. Modifications to Service and Terms
          </h2>
          <p>
            We reserve the right to modify or discontinue the Service at any
            time without notice. We may also update these Terms from time to
            time. Continued use of the Service after any such changes
            constitutes your acceptance of the new Terms.
          </p>
        </section>

        {/* 9. Governing Law */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            9. Governing Law
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of [Your Jurisdiction], without regard to its conflict of law
            principles.
          </p>
        </section>

        {/* 10. Contact Information */}
        <section className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            10. Contact Information
          </h2>
          <p>
            For any questions or concerns regarding these Terms, please contact
            us at:
          </p>
          <p className="font-semibold">
            Email: <a href="mailto:info@notesdaddy.com">info@notesdaddy.com</a>
          </p>
        </section>

        {/* Acknowledgment */}
        <section className="pt-4 border-t border-gray-200">
          <p>
            By using NotesDaddy, you acknowledge that you have read, understood,
            and agree to be bound by these Terms and Conditions.
          </p>
        </section>
      </main>
    </div>
  );
}
