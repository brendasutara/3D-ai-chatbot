import { Lipsync } from "wawa-lipsync";
import { create } from "zustand";

const useChatbot = create((set, get) => ({
  audioPlayer: false,
  lipsyncManager: null,
  setAudioPlayer: () => {
    if (typeof Audio === "undefined") {
      return;
    }
    const audioPlayer = new Audio();
    audioPlayer.crossOrigin = "anonymous";
    audioPlayer.preload = "auto";

    const lipsyncManager = new Lipsync({});
    let lipsyncManagerInitialized = false;

    ((audioPlayer.onplaying = () => {
      if (!lipsyncManagerInitialized) {
        lipsyncManager.connectAudio(audioPlayer);
        lipsyncManagerInitialized = true;
      }
    }),
      set({ audioPlayer, lipsyncManager }));
  },
  playAudio: (url) => {
    const audioPlayer = get().audioPlayer;
    if (!audioPlayer) {
      console.warn("Audio player not initialized");
      return;
    }
    audioPlayer.src = url;
    audioPlayer.play();
  },
  status: "idle",
  messages: [],
  sendMessage: async (message) => {
    const api = import.meta.env.VITE_API_URL;

    set((state) => ({
      messages: [...state.messages, { text: message, sender: "user" }],
      status: "loading",
    }));

    const r = await fetch(
      `${api}/chat?message=${encodeURIComponent(message)}&sessionId=${encodeURIComponent(
        get().sessionId,
      )}`,
    );
    const result = await r.json();

    set((state) => ({
      messages: [...state.messages, { text: result.output, sender: "bot" }],
      status: "idle",
    }));

    // reproducir audio
    get().playAudio(`${api}/tts?message=${encodeURIComponent(result.output)}`);
  },
}));

useChatbot.getState().setAudioPlayer();

export default useChatbot;
