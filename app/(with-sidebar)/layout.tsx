import "../globals.css";
import { SidebarProvider } from "../components/ui/sidebar";
import { ChatSidebar } from "../components/sidebar/chat-sidebar";

export default function WithSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </SidebarProvider>
  );
}
