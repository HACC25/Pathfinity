import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white">
        Pathfinity
          <Button variant="outline">Button</Button>
      </main>
    </div>
  );
}
