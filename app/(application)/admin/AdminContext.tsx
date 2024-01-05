'use client';

import { Series } from '@prisma/client';
import React, {
  createContext, useContext, useState, Dispatch,
} from 'react';

const emptySeries: Series[] = [];
const setSeries: Dispatch<React.SetStateAction<Series[]>> = () => {};
const AdminContext = createContext({
  series: emptySeries,
  setSeries,
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
  const [series, setStateSeries] = useState<Series[]>(dbSeries);

  // This doesn't benefit from useMemo
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    series,
    setSeries: setStateSeries,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
