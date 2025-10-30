import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { ChatBox } from '../components/chat-box';

export default async function Home() {
  const session = await getSession();
  
  // // Redirect to login if not authenticated
  // if (!session) {
  //   redirect('/login');
  // }
  return (
    <div className="flex min-h-screen flex-col items-center ml-5 mr-5">
      <main className="w-full flex-1 flex flex-col items-center justify-between">
        Pathfinity
      </main>

      <div className="w-full pb-5 pl-5 pr-10">
        <ChatBox />
      </div>
    </div>
  );
}
