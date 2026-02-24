import { generateUUID } from "three/src/math/MathUtils.js";
import { create } from "zustand";

const useChatbot = create((set, get) => ({
  status: "idle",
  messages: [],
  sessionId: generateUUID(),
  isAudioEnabled: true,

  // 👄 fake mouth
  isSpeaking: false,
  mouthOpen: 0, // 0..1 (lo vamos a usar para animar)

  _mouthTimer: null,
  _startMouthLoop: () => {
    // evita duplicar timers
    if (get()._mouthTimer) return;

    // abrimos/cerramos la boca con valores pseudo-random
    const timer = setInterval(() => {
      if (!get().isSpeaking) return;

      // variación suave
      const next = 0.25 + Math.random() * 0.75; // 0.25..1
      set({ mouthOpen: next });
    }, 90);

    set({ _mouthTimer: timer });
  },
  _stopMouthLoop: () => {
    const t = get()._mouthTimer;
    if (t) clearInterval(t);
    set({ _mouthTimer: null, mouthOpen: 0 });
  },

  toggleAudio: () => {
    const nextIsAudioEnabled = !get().isAudioEnabled;

    if (
      !nextIsAudioEnabled &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
      get()._stopMouthLoop();
    }

    set((state) => ({
      isAudioEnabled: nextIsAudioEnabled,
      isSpeaking: nextIsAudioEnabled ? state.isSpeaking : false,
      status: nextIsAudioEnabled ? state.status : "idle",
    }));
  },

  speak: (text) => {
    if (!get().isAudioEnabled) return;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis no disponible.");
      return;
    }

    // cancelar cualquier speech anterior
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-AR"; // probá "es-ES" si querés

    utter.onstart = () => {
      set({ status: "speaking", isSpeaking: true });
      get()._startMouthLoop();
    };

    utter.onend = () => {
      set({ status: "idle", isSpeaking: false });
      get()._stopMouthLoop();
    };

    utter.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      set({ status: "idle", isSpeaking: false });
      get()._stopMouthLoop();
    };

    window.speechSynthesis.speak(utter);
  },

  sendMessage: async (message) => {
    const api = import.meta.env.VITE_API_URL;

    set((state) => ({
      messages: [...state.messages, { text: message, sender: "user" }],
      status: "loading",
    }));

    try {
      const r = await fetch(
        `${api}/chat?message=${encodeURIComponent(message)}&sessionId=${encodeURIComponent(
          get().sessionId,
        )}`,
      );

      if (!r.ok) {
        const errText = await r.text();
        console.error("Chat error:", errText);
        set({ status: "idle" });
        return;
      }

      const result = await r.json();
      const botText = result.output ?? "";

      set((state) => ({
        messages: [...state.messages, { text: botText, sender: "bot" }],
        status: "idle",
      }));

      get().speak(botText);
    } catch (e) {
      console.error(e);
      set({ status: "idle" });
    }
  },
}));

export default useChatbot;
