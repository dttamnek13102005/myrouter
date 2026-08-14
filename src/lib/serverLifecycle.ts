export type ServerLifecyclePhase = "starting" | "ready" | "stopping";

declare global {
  var __myrouterServerLifecycle: ServerLifecyclePhase | undefined;
}

export function getServerLifecyclePhase(): ServerLifecyclePhase {
  return globalThis.__myrouterServerLifecycle ?? "starting";
}

export function markServerStarting(): void {
  globalThis.__myrouterServerLifecycle = "starting";
}

export function markServerReady(): void {
  if (getServerLifecyclePhase() !== "stopping") {
    globalThis.__myrouterServerLifecycle = "ready";
  }
}

export function markServerStopping(): void {
  globalThis.__myrouterServerLifecycle = "stopping";
}
