import React from "react";
import { X } from "lucide-react";

/**
 * ImageModal component for displaying images in a modal
 *
 * @param {Object} props Component properties
 * @param {string} props.imageUrl URL of the image to display
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Function to call when the modal is closed
 */
const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle z-50">
      <div className="modal-box relative p-0 bg-base-100 max-w-3xl w-full h-auto overflow-hidden">
        <div className="relative">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2 z-10 bg-base-300/80 hover:bg-base-300"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          <div className="overflow-auto p-1">
            <img
              src={imageUrl}
              alt="Full size"
              className="w-full h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ImageModal;
