import { createContext, useContext } from "react";
import { PuskaStrashnayaStore } from "./scoring";

export const createStore = (): PuskaStrashnayaStore =>
  new PuskaStrashnayaStore();

export const StoreContext = createContext<PuskaStrashnayaStore | null>(null);

export const useStore = (): PuskaStrashnayaStore => {
  const stores = useContext(StoreContext);

  if (!stores) {
    throw new Error(
      "useStore() allow use inside <StoreContext.provider /> only"
    );
  }

  return stores;
};
