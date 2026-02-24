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
  sendMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, { text: message, sender: "user" }],
      status: "loading",
    }));
    setTimeout(() => {
      set((state) => ({
        messages: [
          ...state.messages,
          { text: "This is a response from the chatbot.", sender: "bot" },
        ],
        status: "idle",
      }));
    }, 1000);
  },
}));

useChatbot.getState().setAudioPlayer();

export default useChatbot;
