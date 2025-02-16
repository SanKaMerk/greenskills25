import { useLayoutEffect, useMemo, useState } from "react";
export const TOKEN_KEY = "TOKEN";

interface IMediaQueries {
  desktopM: boolean;
  heightM: boolean;
}

export const getToken = (): string | null => {
  const tkn = localStorage.getItem(TOKEN_KEY);
  return tkn;
};

export const setToken = (tkn: string): void => {
  localStorage.setItem(TOKEN_KEY, tkn);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const useMediaQuery = (query: string): boolean => {
  const mediaQuery = useMemo(() => window.matchMedia(query), [query]);
  const [match, setMatch] = useState(mediaQuery.matches);

  useLayoutEffect(() => {
    const onChange = (): void => setMatch(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, [mediaQuery]);

  return match;
};

export const useMediaQueries = (): IMediaQueries => {
  const desktopM = useMediaQuery("(max-width: 1356px)");
  const heightM = useMediaQuery("(max-height: 980px)");

  return {
    desktopM,
    heightM
  };
};
