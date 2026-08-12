export type DemoRole = "ADMIN" | "AGENT" | "CUSTOMER";

const ROLE_KEY = "escalAIte-demo-role";

export function getDemoRole(): DemoRole {
  const value = window.localStorage.getItem(ROLE_KEY);
  return value === "AGENT" || value === "CUSTOMER" ? value : "ADMIN";
}

export function setDemoRole(role: DemoRole) {
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearDemoRole() {
  window.localStorage.removeItem(ROLE_KEY);
}
