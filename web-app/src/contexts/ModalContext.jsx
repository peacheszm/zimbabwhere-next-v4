"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState({});

  const openModal = (modalName, props = {}) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: { isOpen: true, props },
    }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: { isOpen: false, props: {} },
    }));
  };

  const isModalOpen = (modalName) => {
    return modals[modalName]?.isOpen || false;
  };

  const getModalProps = (modalName) => {
    return modals[modalName]?.props || {};
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        getModalProps,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
