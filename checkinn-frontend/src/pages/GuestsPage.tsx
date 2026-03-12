import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  FileText,
  UserCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Modal } from "@/components/common/Modal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Spinner } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useToast } from "@/store/toast.context";
import { guestService } from "@/features/guests/services/guest.service";
import { reservationService } from "@/features/reservations/services/reservation.service";
import { CreateGuestForm } from "@/features/guests/components/CreateGuestForm";
import { EditGuestForm } from "@/features/guests/components/EditGuestForm";
import type { Guest } from "@/features/guests/types/guest.types";
import type { Reservation } from "@/features/reservations/types/reservation.types";
import { ApiError } from "@/services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export default function GuestsPage() {
  const toast = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    reservationService
      .findAll(1, 100)
      .then((res) => setReservations(res.data))
      .finally(() => setLoadingReservations(false));
  }, []);

  const fetchGuests = (reservationId: string) => {
    setLoadingGuests(true);
    guestService
      .findByReservation(reservationId)
      .then(setGuests)
      .catch((err) => {
        console.error("Erro ao carregar hóspedes:", err);
        setGuests([]);
      })
      .finally(() => setLoadingGuests(false));
  };

  const handleReservationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedReservationId(newId);

    if (newId) {
      fetchGuests(newId);
    } else {
      setGuests([]);
    }
  };

  const handleDelete = async () => {
    if (!deletingGuest) return;
    setDeleteLoading(true);
    try {
      await guestService.remove(deletingGuest.id);
      toast.success("Hóspede removido com sucesso!");
      setDeletingGuest(null);
      if (selectedReservationId) fetchGuests(selectedReservationId);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao remover hóspede",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const reservationOptions = reservations.map((r) => ({
    value: r.id,
    label: `${r.responsibleName} — ${new Date(r.checkInDate).toLocaleDateString("pt-BR")}`,
  }));

  return (
    <div className="space-y-6 mt-8 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
            Hóspedes
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Gerencie hóspedes por reserva
          </p>
        </div>
        {selectedReservationId && (
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} />
            Novo Hóspede
          </Button>
        )}
      </div>

      {/* Seletor de reserva */}
      <Card>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            {loadingReservations ? (
              <Spinner size={24} className="py-2" />
            ) : (
              <Select
                label="Selecione uma reserva"
                options={reservationOptions}
                placeholder="Escolha a reserva para ver os hóspedes"
                value={selectedReservationId}
                onChange={handleReservationChange}
              />
            )}
          </div>
          <div className="pb-0.5">
            <Search size={20} className="text-[var(--color-text-muted)]" />
          </div>
        </div>
      </Card>

      {/* Lista de hóspedes */}
      {!selectedReservationId ? (
        <EmptyState
          icon={Users}
          title="Selecione uma reserva"
          description="Escolha uma reserva acima para visualizar seus hóspedes."
        />
      ) : loadingGuests ? (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : guests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum hóspede nesta reserva"
          description="Cadastre um hóspede para esta reserva."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guests.map((guest, i) => (
            <motion.div
              key={guest.id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i}
            >
              <Card hoverable>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                    <UserCircle
                      size={22}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--color-text)] truncate">
                        {guest.name}
                      </h3>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="p-1 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingGuest(guest)}
                          className="p-1 rounded text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mt-1">
                      <FileText size={13} />
                      <span>
                        {guest.documentType}: {guest.document}
                      </span>
                    </div>
                    {guest.email && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">
                        {guest.email}
                      </p>
                    )}
                    {guest.phone && (
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {guest.phone}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de criação */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Novo Hóspede"
      >
        <CreateGuestForm
          reservationId={selectedReservationId}
          onCreated={(guest) => {
            setGuests((prev) => [...prev, guest]);
            setCreateModalOpen(false);
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal de edição */}
      <Modal
        isOpen={!!editingGuest}
        onClose={() => setEditingGuest(null)}
        title="Editar Hóspede"
      >
        {editingGuest && (
          <EditGuestForm
            guest={editingGuest}
            onUpdated={(updated) => {
              setGuests((prev) =>
                prev.map((g) => (g.id === updated.id ? updated : g)),
              );
              setEditingGuest(null);
            }}
            onCancel={() => setEditingGuest(null)}
          />
        )}
      </Modal>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        isOpen={!!deletingGuest}
        onClose={() => setDeletingGuest(null)}
        onConfirm={handleDelete}
        title="Remover Hóspede"
        message={`Tem certeza que deseja remover o hóspede "${deletingGuest?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={deleteLoading}
      />
    </div>
  );
}
