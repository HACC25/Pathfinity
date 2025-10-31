"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import Conversation from "@/app/components/chat/conversation";
import PromptBox from "@/app/components/chat/prompt-box";

const models = [
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
];

export default function Home() {
  const [model, setModel] = useState(models[0].id);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: any) => {
    if (!message.text) {
      return;
    }
    sendMessage({
      text: message.text,
    });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation messages={messages} status={status} className="h-full" />

        <PromptBox
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          models={models}
          model={model}
          setModel={setModel}
          status={status}
          className="mt-4"
        />
      </div>
    </div>
  );
}
