import { type SubmitEvent, useEffect, useState } from "react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { useToast } from "@/store/toast.context";
import { reservationService } from "@/features/reservations/services/reservation.service";
import { hotelService } from "@/features/hotels/services/hotel.service";
import type { Reservation } from "@/features/reservations/types/reservation.types";
import type { Hotel } from "@/features/hotels/types/hotel.types";
import { ApiError } from "@/services/api";

interface Props {
  onCreated: (reservation: Reservation) => void;
  onCancel: () => void;
}

export function CreateReservationForm({ onCreated, onCancel }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState({
    hotelId: "",
    checkInDate: "",
    checkOutDate: "",
    responsibleName: "",
    responsibleEmail: "",
    responsiblePhone: "",
    roomCount: "1",
    notes: "",
  });

  useEffect(() => {
    hotelService.findAll().then(setHotels);
  }, []);

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const reservation = await reservationService.create({
        hotelId: form.hotelId,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        responsibleName: form.responsibleName,
        responsibleEmail: form.responsibleEmail || undefined,
        responsiblePhone: form.responsiblePhone || undefined,
        roomCount: Number(form.roomCount),
        notes: form.notes || undefined,
      });
      toast.success("Reserva criada com sucesso!");
      onCreated(reservation);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao criar reserva",
      );
    } finally {
      setLoading(false);
    }
  }

  const hotelOptions = hotels.map((h) => ({
    value: h.id,
    label: `${h.name} — ${h.city}/${h.state}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Hotel *"
        options={hotelOptions}
        placeholder="Selecione um hotel"
        value={form.hotelId}
        onChange={set("hotelId")}
        required
      />
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
        placeholder="João Silva"
        value={form.responsibleName}
        onChange={set("responsibleName")}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="joao@email.com"
          value={form.responsibleEmail}
          onChange={set("responsibleEmail")}
        />
        <Input
          label="Telefone"
          placeholder="(11) 9999-9999"
          value={form.responsiblePhone}
          onChange={set("responsiblePhone")}
        />
      </div>
      <Input
        label="Quartos"
        type="number"
        min={1}
        placeholder="1"
        value={form.roomCount}
        onChange={set("roomCount")}
      />
      <Input
        label="Observações"
        placeholder="Notas adicionais..."
        value={form.notes}
        onChange={set("notes")}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Criar Reserva
        </Button>
      </div>
    </form>
  );
}
