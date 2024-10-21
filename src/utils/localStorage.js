// Set Item in Local Storage
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting item in local storage", error);
  }
};

// Get Item from Local Storage
export const getItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error getting item from local storage", error);
    return null;
  }
};

// Remove Item from Local Storage
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from local storage", error);
  }
};

// Clear All Items in Local Storage
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing local storage", error);
  }
};

// Check if a Key Exists in Local Storage
export const keyExists = (key) => {
  return localStorage.getItem(key) !== null;
};

export const setAuthTokenExpiry = () => {
  setItem("authToken_expiry", new Date(Date.now() + 3600000).toISOString());
};

export const setSessionitem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting item in local storage", error);
  }
};
export const getSessionitem = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error("Error setting item in local storage", error);
  }
};

export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing local storage", error);
  }
};
