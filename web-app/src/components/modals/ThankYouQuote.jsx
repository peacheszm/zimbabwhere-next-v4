import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";

import {
  IconPlus,
  IconMapPin,
  IconChevronDown,
  IconClock,
} from "@tabler/icons-react";

export default function ThankYouQuoteModal({ clearForm }) {
  const { isModalOpen, getModalProps, closeModal } = useModal();
  const isThankYouQuoteModal = isModalOpen("ThankYouQuoteModal");

  return (
    <>
      {isThankYouQuoteModal && (
        <Modal
          title={
            "Your quote is being sent to our listed businesses and may take a moment to reflect on the Quote Request page."
          }
          onClose={() => closeModal("ThankYouQuoteModal")}
        >
          <div className="btn_group">
            <Link href="/" className="btn btn-green">
              View all quotes
            </Link>
            <button onClick={clearForm} className="btn btn-green">
              Request new quote
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
