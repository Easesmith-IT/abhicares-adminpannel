/**
 * Simple storage utility to encrypt/obfuscate stored items
 * to prevent plaintext modifications.
 */

// Obfuscate using Base64
const encrypt = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonString));
  } catch (e) {
    return "";
  }
};

const decrypt = (cipher) => {
  if (!cipher) return null;
  try {
    const jsonString = decodeURIComponent(atob(cipher));
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

export const setSecureItem = (key, value, useSession = true) => {
  const cipher = encrypt(value);
  if (useSession) {
    sessionStorage.setItem(key, cipher);
  } else {
    localStorage.setItem(key, cipher);
  }
};

export const getSecureItem = (key, useSession = true) => {
  const cipher = useSession 
    ? sessionStorage.getItem(key) 
    : localStorage.getItem(key);
  
  if (!cipher) {
    // Fallback check the other storage to handle migration gracefully
    const fallbackCipher = useSession 
      ? localStorage.getItem(key) 
      : sessionStorage.getItem(key);
    
    if (fallbackCipher) {
      return decrypt(fallbackCipher);
    }
    return null;
  }
  return decrypt(cipher);
};

export const removeSecureItem = (key) => {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
};
