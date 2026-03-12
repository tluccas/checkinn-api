import { type FormEvent, useState } from "react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { useToast } from "@/store/toast.context";
import { guestService } from "@/features/guests/services/guest.service";
import type {
  Guest,
  UpdateGuestRequest,
} from "@/features/guests/types/guest.types";
import { ApiError } from "@/services/api";

interface Props {
  guest: Guest;
  onUpdated: (guest: Guest) => void;
  onCancel: () => void;
}

export function EditGuestForm({ guest, onUpdated, onCancel }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: guest.name,
    document: guest.document,
    documentType: guest.documentType as "CPF" | "PASSPORT",
    email: guest.email || "",
    phone: guest.phone || "",
  });

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data: UpdateGuestRequest = {
        name: form.name,
        document: form.document,
        documentType: form.documentType,
        email: form.email || undefined,
        phone: form.phone || undefined,
      };
      const updated = await guestService.update(guest.id, data);
      toast.success("Hóspede atualizado com sucesso!");
      onUpdated(updated);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao atualizar hóspede",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nome *" value={form.name} onChange={set("name")} required />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo de Documento"
          options={[
            { value: "CPF", label: "CPF" },
            { value: "PASSPORT", label: "Passaporte" },
          ]}
          value={form.documentType}
          onChange={set("documentType")}
        />
        <Input
          label="Documento *"
          value={form.document}
          onChange={set("document")}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={set("email")}
        />
        <Input label="Telefone" value={form.phone} onChange={set("phone")} />
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
