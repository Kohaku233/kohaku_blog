import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[64rem] mx-auto px-4">
        <Header />
        <main className="py-24">{children}</main>
      </div>
    </div>
  );
}
