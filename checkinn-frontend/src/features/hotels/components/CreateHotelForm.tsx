import { type SubmitEvent, useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useToast } from "@/store/toast.context";
import { hotelService } from "@/features/hotels/services/hotel.service";
import type { Hotel } from "@/features/hotels/types/hotel.types";
import { ApiError } from "@/services/api";

interface Props {
  onCreated: (hotel: Hotel) => void;
  onCancel: () => void;
}

export function CreateHotelForm({ onCreated, onCancel }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
    totalRooms: "",
    starsRating: "",
    description: "",
    phone: "",
    email: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const hotel = await hotelService.create({
        name: form.name,
        city: form.city,
        state: form.state,
        address: form.address,
        totalRooms: Number(form.totalRooms),
        starsRating: form.starsRating ? Number(form.starsRating) : undefined,
        description: form.description || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
      });
      toast.success("Hotel criado com sucesso!");
      onCreated(hotel);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao criar hotel",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome *"
        placeholder="Grand Hotel"
        value={form.name}
        onChange={set("name")}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Cidade *"
          placeholder="Natal"
          value={form.city}
          onChange={set("city")}
          required
        />
        <Input
          label="Estado *"
          placeholder="RN"
          value={form.state}
          onChange={set("state")}
          required
        />
      </div>
      <Input
        label="Endereço *"
        placeholder="Rua das Flores, 123"
        value={form.address}
        onChange={set("address")}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Total de Quartos *"
          type="number"
          min={1}
          placeholder="50"
          value={form.totalRooms}
          onChange={set("totalRooms")}
          required
        />
        <Input
          label="Estrelas"
          type="number"
          min={1}
          max={5}
          placeholder="1-5"
          value={form.starsRating}
          onChange={set("starsRating")}
        />
      </div>
      <Input
        label="Descrição"
        placeholder="Hotel de luxo..."
        value={form.description}
        onChange={set("description")}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Telefone"
          placeholder="(84) 9999-9999"
          value={form.phone}
          onChange={set("phone")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="contato@hotel.com"
          value={form.email}
          onChange={set("email")}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Criar Hotel
        </Button>
      </div>
    </form>
  );
}
