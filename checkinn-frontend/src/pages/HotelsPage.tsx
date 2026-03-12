import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Hotel,
  Plus,
  Star,
  MapPin,
  DoorOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { PageLoader } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useToast } from "@/store/toast.context";
import { hotelService } from "@/features/hotels/services/hotel.service";
import { CreateHotelForm } from "@/features/hotels/components/CreateHotelForm";
import { EditHotelForm } from "@/features/hotels/components/EditHotelForm";
import type { Hotel as HotelType } from "@/features/hotels/types/hotel.types";
import type { PaginationMeta } from "@/types/pagination.types";
import { ApiError } from "@/services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function HotelsPage() {
  const toast = useToast();
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelType | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<HotelType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchHotels = useCallback((p: number) => {
    setLoading(true);
    hotelService
      .findAll(p, 9)
      .then((res) => {
        setHotels(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHotels(page);
  }, [page, fetchHotels]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deletingHotel) return;
    setDeleteLoading(true);
    try {
      await hotelService.remove(deletingHotel.id);
      toast.success("Hotel removido com sucesso!");
      setDeletingHotel(null);
      fetchHotels(page);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao remover hotel",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && hotels.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6 mt-8 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
            Hotéis
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {meta?.totalItems ?? hotels.length}{" "}
            {(meta?.totalItems ?? hotels.length) === 1
              ? "hotel cadastrado"
              : "hotéis cadastrados"}
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus size={16} />
          Novo Hotel
        </Button>
      </div>

      {/* Lista */}
      {hotels.length === 0 ? (
        <EmptyState
          icon={Hotel}
          title="Nenhum hotel cadastrado"
          description="Crie seu primeiro hotel para começar."
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotels.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
              >
                <Card hoverable className="h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: hotel.starsRating || 0 }).map(
                        (_, idx) => (
                          <Star
                            key={idx}
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                        ),
                      )}
                      {!hotel.starsRating && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          Sem classificação
                        </span>
                      )}
                    </div>
                    {/* Ações */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingHotel(hotel)}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingHotel(hotel)}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] mb-1">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-light)] mb-1">
                    <MapPin size={14} />
                    {hotel.city}, {hotel.state}
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-light)] mb-3">
                    <DoorOpen size={14} />
                    {hotel.totalRooms} quartos
                  </div>

                  {hotel.description && (
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mt-auto">
                      {hotel.description}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
        </>
      )}

      {/* Modal de criação */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Novo Hotel"
      >
        <CreateHotelForm
          onCreated={() => {
            setCreateModalOpen(false);
            fetchHotels(1);
            setPage(1);
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal de edição */}
      <Modal
        isOpen={!!editingHotel}
        onClose={() => setEditingHotel(null)}
        title="Editar Hotel"
      >
        {editingHotel && (
          <EditHotelForm
            hotel={editingHotel}
            onUpdated={() => {
              setEditingHotel(null);
              fetchHotels(page);
            }}
            onCancel={() => setEditingHotel(null)}
          />
        )}
      </Modal>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        isOpen={!!deletingHotel}
        onClose={() => setDeletingHotel(null)}
        onConfirm={handleDelete}
        title="Remover Hotel"
        message={`Tem certeza que deseja remover o hotel "${deletingHotel?.name}"? Esta ação desativará o hotel.`}
        confirmLabel="Remover"
        loading={deleteLoading}
      />
    </div>
  );
}
