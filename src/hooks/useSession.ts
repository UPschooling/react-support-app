import {useCallback} from "react";

export function useSession() {
  function generateRandomString() {
    const buffer = new Uint32Array(28);
    window.crypto.getRandomValues(buffer);
    return Array.from(buffer, (dec) =>
      ("0" + dec.toString(16)).substring(-2),
    ).join("");
  }

  return {
    init: useCallback(() => {
      sessionStorage.clear();
      sessionStorage.setItem("sessionId", generateRandomString());
      sessionStorage.setItem("sessionStartTime", Date.now().toString());
      sessionStorage.setItem("nonce", generateRandomString());
    }, []),
    getItem: useCallback(
      (identifier: string) => sessionStorage.getItem(identifier),
      [],
    ),
    setItem: useCallback(
      (identifier: string, value: unknown) =>
        sessionStorage.setItem(identifier, JSON.stringify(value)),
      [],
    ),
  };
}
