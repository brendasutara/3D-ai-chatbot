import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import useChatbot from "../hooks/useChatbot";

export const UI = () => {
  const messages = useChatbot((state) => state.messages);
  const status = useChatbot((state) => state.status);
  const sendMessage = useChatbot((state) => state.sendMessage);
  const [input, setInput] = useState("");
  const isLoading = status === "loading";

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }
    sendMessage(text);
    setInput("");
  };

  return (
    <main className="fixed inset-0 z-10 flex items-end justify-center p-4 pointer-events-none">
      <section className="pointer-events-auto w-full max-w-2xl rounded-xl overflow-hidden flex flex-col">
        <div className="max-h-56 p-4 space-y-3 overflow-y-auto min-h-0">
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
          <div className="relative">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="w-full rounded-full border border-gray-300 pl-3 pr-12 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label={isLoading ? "Sending message" : "Send message"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              {isLoading ? (
                <ImSpinner2 className="h-5 w-5 animate-spin" />
              ) : (
                <IoSend className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
