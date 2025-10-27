import ChatSidebar from "../components/chat-sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <ChatSidebar />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white">
        Pathfinity
      </main>
    </div>
  );
}
