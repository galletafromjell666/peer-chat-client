# peer-chat-client

PeerChat Client is a feature-rich front-end application built for private and direct peer-to-peer communication. Developed with React, Socket.IO, Zustand, Ant Design (AntD), React Router, and SWR, it delivers a polished and efficient user experience.

## Key Features

- **Messaging & File Sharing:** Exchange messages and files directly with your peer, prioritizing privacy and speed.
- **Video Chat:** Make video and audio calls with no intermediary servers, ensuring your data stays private.
- **Customizable Media Settings:** Adjust your audio and video devices through an easy-to-use settings menu.
- **Simple Room Management:** Quickly create or join chat rooms without requiring login or personal details.

PeerChat Client integrates with the [PeerChat Server](https://github.com/galletafromjell666/peer-chat-signaling-server), using Socket.IO for signaling and establishing peer-to-peer connections. It ensures a reliable communication experience without storing data on servers.

## Media

![createJoin](https://github.com/user-attachments/assets/6b207248-4752-49d8-a9cb-5521268101fe)

![conversation](https://github.com/user-attachments/assets/f27472fb-47d8-4c58-b4fa-913af1f7e7b6)

![informationWindow](https://github.com/user-attachments/assets/2642db35-fd97-4c43-8f3f-3fdb437a59b8)

![videochat](https://github.com/user-attachments/assets/02800e17-6f6b-4b12-a113-b0bad5ca2fef)

![devicesModal](https://github.com/user-attachments/assets/2e18b845-4e30-4760-86f0-59101acb6cc3)

<details>
  <summary><h5>Landing page (Click to expand)</h5></summary>
  <img src="https://github.com/user-attachments/assets/56f3167e-0584-4271-ab6e-354240627411"/>
</details>

## Technical Features

Here’s a small list of features that caught my attention and were interesting to develop:

- **Perfect Negotiation Pattern:** This pattern simplifies adding and removing tracks, as well as establishing connections between peers. It helps manage the connection lifecycle smoothly. [MDN DOCS](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation)

- **File Transfer:** Sending files over WebRTC is not straightforward. On the sender’s side, files are sliced into smaller chunks to be sent through the WebRTC data channel. On the receiver’s side, the chunks are reassembled to reconstruct the file. It’s easier said than done haha.

- **Handling Peer Disconnection:** When a peer disconnects, the remaining peer needs to create a new offer, generate ICE candidates, and re-establish the connection.

- **Media Streams:** Adding a MediaStream to an already established RTCPeerConnection is straightforward, but dealing with media device constraints and updating the stream when a device changes is more complex. Often, renegotiation is required—but thankfully, the perfect negotiation pattern helps a lot! :)

- **Integrating WebSockets with RTCPeerConnection:** Creating a context and custom hooks to integrate WebSockets with RTCPeerConnection made the codebase much more readable and maintainable.

- **SSL Certificates:** Since getUserMedia is only available in secure contexts, I had to generate self-signed certificates to enable it for my local development environment.

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
chrome://flags/#
```

If the flag `allow-insecure-localhost` is not available please check the flags `Temporarily unexpire MXXX flags`

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
