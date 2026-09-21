import { createContext, useContext } from "react";

const DashboardContext = createContext(null);

export const DashboardContextProvider = DashboardContext.Provider;

export function useDashboardContext() {
  const value = useContext(DashboardContext);
  if (!value) {
    throw new Error("useDashboardContext must be used within a DashboardContextProvider");
  }
  return value;
}
