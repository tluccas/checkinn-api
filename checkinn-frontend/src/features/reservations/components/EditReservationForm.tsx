import { type FormEvent, useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useToast } from "@/store/toast.context";
import { reservationService } from "@/features/reservations/services/reservation.service";
import type {
  Reservation,
  UpdateReservationRequest,
} from "@/features/reservations/types/reservation.types";
import { ApiError } from "@/services/api";

interface Props {
  reservation: Reservation;
  onUpdated: (reservation: Reservation) => void;
  onCancel: () => void;
}

export function EditReservationForm({
  reservation,
  onUpdated,
  onCancel,
}: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    checkInDate: reservation.checkInDate.split("T")[0],
    checkOutDate: reservation.checkOutDate.split("T")[0],
    responsibleName: reservation.responsibleName,
    responsibleEmail: reservation.responsibleEmail || "",
    responsiblePhone: reservation.responsiblePhone || "",
    roomCount: String(reservation.roomCount),
    notes: reservation.notes || "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const data: UpdateReservationRequest = {
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        responsibleName: form.responsibleName,
        responsibleEmail: form.responsibleEmail || undefined,
        responsiblePhone: form.responsiblePhone || undefined,
        roomCount: Number(form.roomCount),
        notes: form.notes || undefined,
      };
      const updated = await reservationService.update(reservation.id, data);
      toast.success("Reserva atualizada com sucesso!");
      onUpdated(updated);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao atualizar reserva",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Check-in *"
          type="date"
          value={form.checkInDate}
          onChange={set("checkInDate")}
          required
        />
        <Input
          label="Check-out *"
          type="date"
          value={form.checkOutDate}
          onChange={set("checkOutDate")}
          required
        />
      </div>
      <Input
        label="Responsável *"
        value={form.responsibleName}
        onChange={set("responsibleName")}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={form.responsibleEmail}
          onChange={set("responsibleEmail")}
        />
        <Input
          label="Telefone"
          value={form.responsiblePhone}
          onChange={set("responsiblePhone")}
        />
      </div>
      <Input
        label="Quartos"
        type="number"
        min={1}
        value={form.roomCount}
        onChange={set("roomCount")}
      />
      <Input label="Observações" value={form.notes} onChange={set("notes")} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
