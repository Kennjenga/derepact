// app/verification-success/page.tsx
export default function VerificationSuccess() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Email Verified Successfully!
      </h1>
      <p className="text-gray-600 mb-4">
        Your email has been verified. You can now use all features of your
        account.
      </p>
      <a
        href="/dashboard"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
