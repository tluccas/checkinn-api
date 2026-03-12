import { type FormEvent, useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useToast } from "@/store/toast.context";
import { hotelService } from "@/features/hotels/services/hotel.service";
import type {
  Hotel,
  UpdateHotelRequest,
} from "@/features/hotels/types/hotel.types";
import { ApiError } from "@/services/api";

interface Props {
  hotel: Hotel;
  onUpdated: (hotel: Hotel) => void;
  onCancel: () => void;
}

export function EditHotelForm({ hotel, onUpdated, onCancel }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: hotel.name,
    city: hotel.city,
    state: hotel.state,
    address: hotel.address,
    totalRooms: String(hotel.totalRooms),
    starsRating: hotel.starsRating ? String(hotel.starsRating) : "",
    description: hotel.description || "",
    phone: hotel.phone || "",
    email: hotel.email || "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const data: UpdateHotelRequest = {
        name: form.name,
        city: form.city,
        state: form.state,
        address: form.address,
        totalRooms: Number(form.totalRooms),
        starsRating: form.starsRating ? Number(form.starsRating) : undefined,
        description: form.description || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
      };
      const updated = await hotelService.update(hotel.id, data);
      toast.success("Hotel atualizado com sucesso!");
      onUpdated(updated);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao atualizar hotel",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nome *" value={form.name} onChange={set("name")} required />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Cidade *"
          value={form.city}
          onChange={set("city")}
          required
        />
        <Input
          label="Estado *"
          value={form.state}
          onChange={set("state")}
          required
        />
      </div>
      <Input
        label="Endereço *"
        value={form.address}
        onChange={set("address")}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Total de Quartos *"
          type="number"
          min={1}
          value={form.totalRooms}
          onChange={set("totalRooms")}
          required
        />
        <Input
          label="Estrelas"
          type="number"
          min={1}
          max={5}
          value={form.starsRating}
          onChange={set("starsRating")}
        />
      </div>
      <Input
        label="Descrição"
        value={form.description}
        onChange={set("description")}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Telefone" value={form.phone} onChange={set("phone")} />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={set("email")}
        />
      </div>
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
