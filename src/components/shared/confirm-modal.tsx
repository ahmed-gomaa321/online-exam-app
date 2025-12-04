"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  icon,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes, delete",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <aside
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <section
        className={`relative bg-white shadow-lg w-4/5 md:w-1/2 xl:w-1/3 pt-14 transform transition-transform duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* x button */}
        <button
          onClick={onCancel}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <header className="mb-8 flex justify-center">
          {icon ? (
            icon
          ) : (
            <div className="flex items-center justify-center w-[120px] h-[120px] rounded-full bg-red-50">
              <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-red-100">
                <AlertTriangle className="text-red-600 w-12 h-12" />
              </div>
            </div>
          )}
        </header>

        {/* Title */}
        <header className="px-4 xl:px-9">
          <h2
            id="confirm-modal-title"
            className="xl:text-lg font-medium mb-2 text-center text-red-600"
          >
            {title}
          </h2>
        </header>

        {/* Description */}
        <p
          id="confirm-modal-description"
          className="px-4 xl:px-9 text-xs xl:text-sm text-gray-500 mb-6 text-center"
        >
          {description}
        </p>

        {/* Buttons */}
        <footer className="grid grid-cols-2 gap-2 border-t border-t-gray-200 py-6 xl:px-14 px-4">
          <Button variant={"secondary"} onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={"destructive"} onClick={onConfirm}>
            {confirmText}
          </Button>
        </footer>
      </section>
    </aside>
  );
}
