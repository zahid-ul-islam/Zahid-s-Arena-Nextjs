"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "react-toastify";

export default function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteProduct(id);

      if (res.success) {
        setShowModal(false);
        toast.success("Product deleted successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this football kit? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </>
  );
}
