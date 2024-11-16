import { useSyncExternalStore } from "react";

let incomingMediaStream: MediaStream | null = null;
let outgoingMediaStream: MediaStream | null = null;

const listeners = new Set();

function setIncomingMediaStream(stream: MediaStream | null) {
  incomingMediaStream = stream;
  notifyListeners();
}

function setOutgoingMediaStream(stream: MediaStream | null) {
  outgoingMediaStream = stream;
  notifyListeners();
}

function subscribe(callback: any) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((listener: any) => listener());
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
