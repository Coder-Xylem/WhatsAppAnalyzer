import { Link } from "wouter";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[#128C7E] shadow-sm">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">WhatsApp Analyzer</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:text-white/90" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          
          <Button variant="ghost" className="text-white hover:text-white/90" asChild>
            <Link href="/help">Help</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}