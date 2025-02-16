import { Navbar } from '@/app/components/ui/navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <header className="absolute w-full">
        <Navbar />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}