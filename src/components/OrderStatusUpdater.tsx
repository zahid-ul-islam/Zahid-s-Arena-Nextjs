"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "react-toastify";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        toast.success("Order status updated");
        router.refresh();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-2">
      <select
        value={status}
        onChange={(e) => handleUpdate(e.target.value)}
        disabled={isUpdating}
        className={clsx(
          "px-3 py-1 rounded-full text-sm font-medium border",
          status === "pending" &&
            "bg-yellow-100 text-yellow-800 border-yellow-300",
          status === "processing" &&
            "bg-blue-100 text-blue-800 border-blue-300",
          status === "shipped" &&
            "bg-purple-100 text-purple-800 border-purple-300",
          status === "delivered" &&
            "bg-green-100 text-green-800 border-green-300",
          status === "cancelled" && "bg-red-100 text-red-800 border-red-300",
          "disabled:opacity-50"
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
