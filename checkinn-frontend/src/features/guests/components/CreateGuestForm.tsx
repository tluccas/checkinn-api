import { type SubmitEvent, useState } from "react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { useToast } from "@/store/toast.context";
import { guestService } from "@/features/guests/services/guest.service";
import type { Guest } from "@/features/guests/types/guest.types";
import { ApiError } from "@/services/api";

interface Props {
  reservationId: string;
  onCreated: (guest: Guest) => void;
  onCancel: () => void;
}

export function CreateGuestForm({ reservationId, onCreated, onCancel }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    document: "",
    documentType: "CPF" as "CPF" | "PASSPORT",
    email: "",
    phone: "",
  });

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const guest = await guestService.create({
        name: form.name,
        document: form.document,
        documentType: form.documentType,
        reservationId,
        email: form.email || undefined,
        phone: form.phone || undefined,
      });
      toast.success("Hóspede cadastrado com sucesso!");
      onCreated(guest);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao cadastrar hóspede",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome *"
        placeholder="Nome do hóspede"
        value={form.name}
        onChange={set("name")}
        required
      />
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
          placeholder={form.documentType === "CPF" ? "12345678901" : "AB123456"}
          value={form.document}
          onChange={set("document")}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="seuemail@email.com"
          value={form.email}
          onChange={set("email")}
        />
        <Input
          label="Telefone"
          placeholder="(84) 9999-9999"
          value={form.phone}
          onChange={set("phone")}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Cadastrar Hóspede
        </Button>
      </div>
    </form>
  );
}
