
"use client";

// This file is a workaround for a circular dependency issue between useAuth and useConnections.
// In a real application, you would likely structure your state management differently
// (e.g., using a more robust state management library like Redux or Zustand, or by restructuring providers)
// to avoid this. For this example, we're just wrapping the children in the AuthProvider.

import { AuthProvider } from "./use-auth";

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
