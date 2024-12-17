import React, { createContext, useState } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ReviewContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </ReviewContext.Provider>
  );
};