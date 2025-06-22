// src/components/layout/AppLogo.tsx
import { DollarSign } from 'lucide-react'; // Changed icon
import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
      <DollarSign className="h-7 w-7" /> {/* Changed icon */}
      <span>Sage Advisor</span> {/* Changed App Name */}
    </Link>
  );
}
