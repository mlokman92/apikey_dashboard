import Link from 'next/link';

export default function Logo() {
  return (
    <div className="mb-8 px-2">
      <Link href="/" className="text-xl font-bold">
        Your Logo
      </Link>
    </div>
  );
} 