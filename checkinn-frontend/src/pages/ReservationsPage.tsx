import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Plus,
  User,
  DoorOpen,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { PageLoader } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useToast } from "@/store/toast.context";
import { reservationService } from "@/features/reservations/services/reservation.service";
import { CreateReservationForm } from "@/features/reservations/components/CreateReservationForm";
import { EditReservationForm } from "@/features/reservations/components/EditReservationForm";
import type {
  Reservation,
  ReservationStatus,
} from "@/features/reservations/types/reservation.types";
import type { PaginationMeta } from "@/types/pagination.types";
import { ApiError } from "@/services/api";

const statusStyles: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  checked_in: "bg-blue-100 text-blue-700",
  checked_out: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  checked_in: "Check-in",
  checked_out: "Check-out",
};

// Transições de status permitidas (espelha o backend)
const statusTransitions: Record<
  string,
  { label: string; status: ReservationStatus; icon: typeof LogIn }[]
> = {
  confirmed: [
    { label: "Check-in", status: "CHECKED_IN", icon: LogIn },
    { label: "Cancelar", status: "CANCELLED", icon: XCircle },
  ],
  checked_in: [{ label: "Check-out", status: "CHECKED_OUT", icon: LogOut }],
  checked_out: [],
  cancelled: [],
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

function normalizeStatus(status: string) {
  return status.toLowerCase().replace(/ /g, "_");
}

export default function ReservationsPage() {
  const toast = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [deletingReservation, setDeletingReservation] =
    useState<Reservation | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const fetchReservations = useCallback((p: number) => {
    setLoading(true);
    reservationService
      .findAll(p, 10)
      .then((res) => {
        setReservations(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReservations(page);
  }, [page, fetchReservations]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    setStatusLoading(id);
    try {
      await reservationService.updateStatus(id, { status });
      toast.success(
        `Status atualizado para ${statusLabels[normalizeStatus(status)]}`,
      );
      fetchReservations(page);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao atualizar status",
      );
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingReservation) return;
    setDeleteLoading(true);
    try {
      await reservationService.remove(deletingReservation.id);
      toast.success("Reserva removida com sucesso!");
      setDeletingReservation(null);
      fetchReservations(page);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao remover reserva",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && reservations.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6 mt-8 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
            Reservas
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {meta?.totalItems ?? reservations.length}{" "}
            {(meta?.totalItems ?? reservations.length) === 1
              ? "reserva encontrada"
              : "reservas encontradas"}
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus size={16} />
          Nova Reserva
        </Button>
      </div>

      {/* Lista */}
      {reservations.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Nenhuma reserva encontrada"
          description="Crie sua primeira reserva."
        />
      ) : (
        <>
          <div className="grid gap-4">
            {reservations.map((res, i) => {
              const ns = normalizeStatus(res.status);
              const transitions = statusTransitions[ns] || [];

              return (
                <motion.div
                  key={res.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i}
                >
                  <Card className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--color-text)]">
                          {res.responsibleName}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[ns] || "bg-gray-100"}`}
                        >
                          {statusLabels[ns] || res.status}
                        </span>
                      </div>
                      {res.hotel && (
                        <p className="text-sm text-[var(--color-text-light)]">
                          {res.hotel.name}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <CalendarCheck size={14} />
                          {new Date(res.checkInDate).toLocaleDateString(
                            "pt-BR",
                          )}{" "}
                          →{" "}
                          {new Date(res.checkOutDate).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <DoorOpen size={14} />
                          {res.roomCount}{" "}
                          {res.roomCount === 1 ? "quarto" : "quartos"}
                        </span>
                        {res.guestCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {res.guestCount}{" "}
                            {res.guestCount === 1 ? "hóspede" : "hóspedes"}
                          </span>
                        )}
                      </div>
                      {res.notes && (
                        <p className="text-xs text-[var(--color-text-muted)] italic mt-1">
                          {res.notes}
                        </p>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Botões de transição de status */}
                      {transitions.map((t) => (
                        <button
                          key={t.status}
                          onClick={() => handleStatusChange(res.id, t.status)}
                          disabled={statusLoading === res.id}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-40"
                          title={t.label}
                        >
                          <t.icon size={16} />
                        </button>
                      ))}
                      <button
                        onClick={() => setEditingReservation(res)}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingReservation(res)}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
        </>
      )}

      {/* Modal de criação */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nova Reserva"
      >
        <CreateReservationForm
          onCreated={() => {
            setCreateModalOpen(false);
            fetchReservations(1);
            setPage(1);
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal de edição */}
      <Modal
        isOpen={!!editingReservation}
        onClose={() => setEditingReservation(null)}
        title="Editar Reserva"
      >
        {editingReservation && (
          <EditReservationForm
            reservation={editingReservation}
            onUpdated={() => {
              setEditingReservation(null);
              fetchReservations(page);
            }}
            onCancel={() => setEditingReservation(null)}
          />
        )}
      </Modal>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        isOpen={!!deletingReservation}
        onClose={() => setDeletingReservation(null)}
        onConfirm={handleDelete}
        title="Remover Reserva"
        message={`Tem certeza que deseja remover a reserva de "${deletingReservation?.responsibleName}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={deleteLoading}
      />
    </div>
  );
}
