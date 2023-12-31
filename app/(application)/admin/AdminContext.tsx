"use client";

import { Series } from "@prisma/client";
import { createContext, useContext, useState, Dispatch } from "react";

const emptySeries: Series[] = [];
const setSeries: Dispatch<React.SetStateAction<Series[]>> = () => {};
const AdminContext = createContext({
  series: emptySeries,
  setSeries: setSeries,
});

export function useAdminContext() {
  return useContext(AdminContext);
}

export default function AdminDataProvider({
  children,
  dbSeries,
}: {
  children: React.ReactNode;
  dbSeries: Series[];
}) {
  const [series, setSeries] = useState<Series[]>(dbSeries);

  const value = {
    series,
    setSeries,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
