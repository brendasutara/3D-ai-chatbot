import { useEffect, useRef, useState } from "react";
import { IoSend, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import useChatbot from "../hooks/useChatbot";

export const UI = () => {
  const messages = useChatbot((state) => state.messages);
  const status = useChatbot((state) => state.status);
  const sendMessage = useChatbot((state) => state.sendMessage);
  const isAudioEnabled = useChatbot((state) => state.isAudioEnabled);
  const toggleAudio = useChatbot((state) => state.toggleAudio);
  const [input, setInput] = useState("");
  const isLoading = status === "loading";

  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput("");
  };

  return (
    <main className="fixed inset-0 z-10 flex flex-col items-center justify-between p-4 pointer-events-none">
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isAudioEnabled ? "Desactivar voz" : "Activar voz"}
        title={isAudioEnabled ? "Silenciar voz del asistente" : "Activar voz del asistente"}
        className="pointer-events-auto absolute right-4 top-4 sm:right-6 sm:top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/35 text-xl text-white backdrop-blur-md transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        {isAudioEnabled ? <IoVolumeHigh className="h-5 w-5" /> : <IoVolumeMute className="h-5 w-5" />}
      </button>

      {/* HEADER */}
      <header className="pointer-events-none mt-6 text-center select-none">
        <h1 className="font-santa text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow">
          Santa AI <span className="inline-block">🎄</span>
        </h1>
        <p className="mt-2 text-base sm:text-lg text-white/90 drop-shadow">
          Pregúntale qué quieres para Navidad
        </p>
      </header>

      {/* CHAT */}
      <section className="pointer-events-auto w-full max-w-2xl rounded-xl overflow-hidden flex flex-col">
        <div
          ref={listRef}
          className="max-h-56 p-4 space-y-3 overflow-y-auto min-h-0 no-scrollbar"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  message.sender === "user"
                    ? "bg-black/20 border border-black/20 text-white rounded-br-md"
                    : "bg-white/20 border border-white/50 text-white rounded-bl-md"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-3">
          <div className="relative">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={isLoading}
              className="w-full rounded-full text-white bg-black/20 border placeholder:text-gray-300 border-black/20 pl-3 pr-12 py-2 text-sm outline-none focus:ring-2 focus:ring-red-900 disabled:bg-black/40"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label={isLoading ? "Enviando mensaje" : "Enviar mensaje"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/50 hover:text-white disabled:opacity-60 disabled:hover:bg-transparent"
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

