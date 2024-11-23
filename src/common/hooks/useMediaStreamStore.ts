import { useSyncExternalStore } from "react";

type Listener = () => void;

export let incomingMediaStream: MediaStream | null = null;
export let outgoingMediaStream: MediaStream | null = null;

const listeners = new Set<Listener>();

function setIncomingMediaStream(stream: MediaStream | null) {
  incomingMediaStream = stream;
  notifyListeners();
}

function setOutgoingMediaStream(stream: MediaStream | null) {
  outgoingMediaStream = stream;
  notifyListeners();
}

function subscribe(callback: Listener) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((listener: Listener) => listener());
}

export function useIncomingMediaStream() {
  return useSyncExternalStore(subscribe, () => incomingMediaStream);
}

export function useOutgoingMediaStream() {
  return useSyncExternalStore(subscribe, () => outgoingMediaStream);
}

export function updateMediaStreams({
  incoming,
  outgoing,
}: {
  incoming?: MediaStream | null;
  outgoing?: MediaStream | null;
}) {
  if (incoming !== undefined) setIncomingMediaStream(incoming);
  if (outgoing !== undefined) setOutgoingMediaStream(outgoing);
}
