"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface ModalContextType {
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBookingModal = useCallback(() => setIsBookingModalOpen(true), []);
  const closeBookingModal = useCallback(() => setIsBookingModalOpen(false), []);

  return (
    <ModalContext.Provider 
      value={{ 
        isBookingModalOpen, 
        openBookingModal, 
        closeBookingModal 
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useBookingModal must be used within a ModalProvider");
  }
  return context;
}
