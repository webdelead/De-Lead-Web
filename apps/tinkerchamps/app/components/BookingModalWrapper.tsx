"use client";

import { useEffect } from "react";
import { useBookingModal } from "../context/ModalContext";
import BookingModal from "./BookingModal";

export default function BookingModalWrapper() {
  const { isBookingModalOpen, openBookingModal, closeBookingModal } = useBookingModal();

  useEffect(() => {
    const timer = setTimeout(() => {
      openBookingModal();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [openBookingModal]);

  return (
    <BookingModal
      isOpen={isBookingModalOpen}
      onClose={closeBookingModal}
    />
  );
}
