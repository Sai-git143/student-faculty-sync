
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./MainSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger className="block lg:hidden mb-4" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
