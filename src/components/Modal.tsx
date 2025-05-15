import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  blurBackdrop?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  blurBackdrop = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const modalElement = modalRef.current;

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      if (modalElement) modalElement.blur();
    };
  }, [isOpen, onClose]);

  const handleAnimationEnd = () => {
    if (!isOpen) setIsVisible(false);
  };

  if (!isVisible) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out ${
          blurBackdrop ? "backdrop-blur-sm" : ""
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        onAnimationEnd={handleAnimationEnd}
        className={`relative w-full ${
          sizeClasses[size]
        } bg-white rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 scale-100 animate-fade-in"
            : "opacity-0 scale-95 animate-fade-out"
        }`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Fechar modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
};

/* Tailwind Animations */
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fade-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
.animate-fade-out {
  animation: fade-out 0.3s ease-in forwards;
}
`;

const styleElement = document.createElement("style");
styleElement.textContent = styles;
document.head.appendChild(styleElement);
