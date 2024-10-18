import { clearStorage, setItem } from "./localStorage";

export const handleUnauthorizedRedirect = () => {
  window.location.href = "/";
  clearStorage();
  setItem("reload", true);
};
