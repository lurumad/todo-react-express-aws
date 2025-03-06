"use client";

import { PropsWithChildren, useEffect, useState } from "react";

export function MockApiProvider({ children }: Readonly<PropsWithChildren>) {
  const [isMockingEnabled, setIsMockingEnabled] = useState(false);

  useEffect(() => {
    async function enableApiMocking() {
      const { worker } = await import("./server/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
      });
      setIsMockingEnabled(true);
    }

    if (!isMockingEnabled) {
      enableApiMocking();
    }
  }, [isMockingEnabled]);

  if (!isMockingEnabled) {
    return null;
  }

  return <>{children}</>;
}
