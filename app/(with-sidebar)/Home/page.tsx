import { ChatBox } from '../../components/chat/chat-box';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center ml-5 mr-5">
      <main className="w-full flex-1 flex flex-col items-center justify-between" style={{ border: '1px solid black'}}>
        Pathfinity
      </main>
      <div className="w-full pb-5 pl-5 pr-10">
        <ChatBox />
      </div>
    </div>
  );
}
