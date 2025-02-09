export default function ProtectedPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Protected Route</h1>
        <p className="text-gray-600">
          This is a protected page that can only be accessed with a valid API key.
        </p>
      </div>
    </div>
  );
} 