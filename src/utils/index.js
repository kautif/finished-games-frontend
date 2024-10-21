import { clearSessionStorage, clearStorage } from "./localStorage";

export const handleUnauthorizedRedirect = () => {
  window.location.href = "/";
  clearStorage();
  clearSessionStorage();
};
