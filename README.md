# PioPio
Aplicacion de chatbot con IA que combina una interfaz conversacional y un avatar 3D en tiempo real usando React Three Fiber (R3F). El proyecto integra un pajarito en formato GLB, una escena estilizada, audio de fondo y voz sintetizada para que la experiencia se sienta viva mientras conversas.

**Vista previa**
![Vista previa](public/Screenshot.png)

**Que hace el proyecto**
- Muestra un avatar 3D con entorno, sombras y postprocesado.
- Renderiza un chat en primer plano con mensajes de usuario y bot.
- Gestiona el estado del chat con Zustand.
- Reproduce voz con SpeechSynthesis y anima la boca con visemes.
- Incluye musica de fondo con toggle.

**Como funciona (resumen tecnico)**
- La escena 3D vive en un `Canvas` de R3F y el chat en una capa UI aparte.
- `Character` carga el modelo `bird_orange.glb`, reproduce la animacion `anim` cuando habla y ajusta los morph targets.
- `useChatbot` centraliza mensajes, estado de carga y voz (SpeechSynthesis).
- Las respuestas llegan desde un backend en `VITE_API_URL` via `/chat`.

**Estructura rapida**
- `src/App.jsx`: layout principal, musica de fondo y postprocesado.
- `src/components/Experience.jsx`: escena, luces y entorno.
- `src/components/Character.jsx`: modelo 3D, animaciones y visemes.
- `src/components/UI.jsx`: interfaz del chat.
- `src/hooks/useChatbot.js`: estado global, envio de mensajes y voz.
- `public/models/`: modelos 3D (GLB).
- `public/audios/`: musica de fondo.

**Instalacion y desarrollo**
```bash
npm install
npm run dev
```

**Scripts**
- `npm run dev`: entorno de desarrollo.
- `npm run build`: build de produccion.
- `npm run preview`: vista previa del build.

**Configuracion**
Crear `.env` con:
```
VITE_API_URL=http://localhost:3000
```

**Creditos**
Modelos 3D (Sketchfab):
- Bird Orange: https://sketchfab.com/3d-models/bird-orange-0d31748606c2499fb652c0c1052b7cfa
- Stylized Hand Painted Scene: https://sketchfab.com/3d-models/stylized-hand-painted-scene-30ddd6d6d8a6491d8b52975c19968099
