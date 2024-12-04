# peer-chat-client

PeerChat Client is a feature-rich front-end application built for private and direct peer-to-peer communication. Developed with React, Socket.IO, Zustand, Ant Design (AntD), React Router, and SWR, it delivers a polished and efficient user experience.

## Key Features:

- **Messaging & File Sharing:** Exchange messages and files directly with your peer, prioritizing privacy and speed.
- **Video Chat:** Make video and audio calls with no intermediary servers, ensuring your data stays private.
- **Customizable Media Settings:** Adjust your audio and video devices through an easy-to-use settings menu.
- **Simple Room Management:** Quickly create or join chat rooms without requiring login or personal details.

PeerChat Client integrates with the PeerChat Server, using Socket.IO for signaling and establishing peer-to-peer connections. Designed with user privacy and simplicity in mind, it ensures a reliable communication experience without storing data on servers.

## Development usage

Clone the repo:

```bash
git clone https://github.com/galletafromjell666/peer-chat-client.git client
```

Move inside the repo:

```bash
cd client
```

Install modules (pnpm is recommended)

```bash
pnpm install
```

Start the development server

```bash
pnpm dev
```

Enable invalid certificates from localhost (required to access user media)

```bash
chrome://flags/#allow-insecure-localhost
```

Open https://localhost:5174/

---

## How to publish a new production build

Login to Cloudflare:

```shell
pnpm wrangler login
```

Create a new build

```shell
pnpm build
```

Publish to Cloudflare pages (Production)

```shell
pnpm wrangler pages deploy dist --project-name peer-chat --branch=main
```
