# peer-chat-client

PeerChat Client is a feature-rich front-end application built for private and direct peer-to-peer communication. Developed with React, Socket.IO, Zustand, Ant Design (AntD), React Router, and SWR, it delivers a polished and efficient user experience.

## Key Features:

- **Messaging & File Sharing:** Exchange messages and files directly with your peer, prioritizing privacy and speed.
- **Video Chat:** Make video and audio calls with no intermediary servers, ensuring your data stays private.
- **Customizable Media Settings:** Adjust your audio and video devices through an easy-to-use settings menu.
- **Simple Room Management:** Quickly create or join chat rooms without requiring login or personal details.

PeerChat Client integrates with the PeerChat Server, using Socket.IO for signaling and establishing peer-to-peer connections. Designed with user privacy and simplicity in mind, it ensures a reliable communication experience without storing data on servers.

## Media

![createJoin](https://github.com/user-attachments/assets/6b207248-4752-49d8-a9cb-5521268101fe)

![conversation](https://github.com/user-attachments/assets/f27472fb-47d8-4c58-b4fa-913af1f7e7b6)

![informationWindow](https://github.com/user-attachments/assets/2642db35-fd97-4c43-8f3f-3fdb437a59b8)

![videochat](https://github.com/user-attachments/assets/02800e17-6f6b-4b12-a113-b0bad5ca2fef)

![devicesModal](https://github.com/user-attachments/assets/2e18b845-4e30-4760-86f0-59101acb6cc3)

<details>
  <summary><h4>Landing page (Click to expand)</h4></summary>
  <img src="https://github.com/user-attachments/assets/56f3167e-0584-4271-ab6e-354240627411"/>
</details>


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
