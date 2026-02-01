import { useCancelReservation } from "@/custom-hooks/useCancelReservation";

interface CancelReservationButtonProps {
  reservationId: string;
  actionLabel: string;
}

export default function CancelReservationButton({
  actionLabel,
  reservationId,
}: CancelReservationButtonProps) {
  const { loadingId, cancelReservation } = useCancelReservation();

  const isLoading = loadingId === reservationId;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        cancelReservation(reservationId);
      }}
      disabled={isLoading}
      className={`mt-3 w-full border border-gray-300 rounded-lg py-2 text-sm font-medium  cursor-pointer hover:bg-gray-100 transition disabled:opacity-50 ${isLoading ? "cursor-not-allowed" : ""}`}
    >
      {isLoading ? "Cancelling..." : actionLabel}
    </button>
  );
}
