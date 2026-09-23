"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { saveBrandVisualsCookie } from "./actions";
import {
  type BrandVisuals,
  DEFAULT_BRAND_VISUALS,
  persistBrandVisuals,
} from "./brandVisuals";

type BrandVisualsContextValue = {
  visuals: BrandVisuals;
  showMascots: boolean;
  setVisuals: (visuals: BrandVisuals) => void;
};

const BrandVisualsContext = createContext<BrandVisualsContextValue>({
  visuals: DEFAULT_BRAND_VISUALS,
  showMascots: true,
  setVisuals: () => {},
});

export function BrandVisualsProvider({
  initial = DEFAULT_BRAND_VISUALS,
  children,
}: {
  initial?: BrandVisuals;
  children: ReactNode;
}) {
  const [visuals, setVisualsState] = useState<BrandVisuals>(initial);

  const setVisuals = useCallback((next: BrandVisuals) => {
    setVisualsState(next);
    persistBrandVisuals(next);
    void saveBrandVisualsCookie(next);
  }, []);

  const value = useMemo(
    () => ({
      visuals,
      showMascots: visuals === "mascots",
      setVisuals,
    }),
    [setVisuals, visuals],
  );

  return (
    <BrandVisualsContext.Provider value={value}>
      {children}
    </BrandVisualsContext.Provider>
  );
}

export function useBrandVisuals() {
  return useContext(BrandVisualsContext);
}
