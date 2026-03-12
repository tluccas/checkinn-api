import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, CalendarCheck, Users, Plus, ArrowRight } from "lucide-react";
import { Card } from "@/components/common/Card";
import { PageLoader } from "@/components/common/Spinner";
import { hotelService } from "@/features/hotels/services/hotel.service";
import { reservationService } from "@/features/reservations/services/reservation.service";
import type { Reservation } from "@/features/reservations/types/reservation.types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function DashboardPage() {
  const [hotelCount, setHotelCount] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      hotelService.findAll(1, 1),
      reservationService.findAll(1, 100),
    ])
      .then(([h, r]) => {
        setHotelCount(h.meta.totalItems);
        setReservations(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const confirmedCount = reservations.filter(
    (r) => r.status === "CONFIRMED",
  ).length;
  const checkedInCount = reservations.filter(
    (r) => r.status === "CHECKED_IN",
  ).length;

  const stats = [
    {
      label: "Hotéis Cadastrados",
      value: hotelCount,
      icon: Hotel,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total de Reservas",
      value: reservations.length,
      icon: CalendarCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Confirmadas",
      value: confirmedCount,
      icon: CalendarCheck,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Check-in Ativo",
      value: checkedInCount,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8 mt-8 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Visão geral do seu sistema
          </p>
        </div>
        <Link
          to="/hotels"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus size={16} />
          Novo Hotel
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
          >
            <Card className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)] select-none">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] select-none">
                  {stat.label}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            to: "/hotels",
            label: "Gerenciar Hotéis",
            desc: "Cadastrar e visualizar hotéis",
            icon: Hotel,
          },
          {
            to: "/reservations",
            label: "Gerenciar Reservas",
            desc: "Criar e acompanhar reservas",
            icon: CalendarCheck,
          },
          {
            to: "/guests",
            label: "Gerenciar Hóspedes",
            desc: "Cadastrar hóspedes nas reservas",
            icon: Users,
          },
        ].map((item, i) => (
          <motion.div
            key={item.to}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 4}
          >
            <Link to={item.to}>
              <Card hoverable className="group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <item.icon
                        size={20}
                        className="text-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text)]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent reservations */}
      {reservations.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--color-text)]">
              Reservas Recentes
            </h2>
            <Link
              to="/reservations"
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-secondary)]/60">
                  <th className="text-left py-2 px-3 text-[var(--color-text-muted)] font-medium">
                    Responsável
                  </th>
                  <th className="text-left py-2 px-3 text-[var(--color-text-muted)] font-medium">
                    Check-in
                  </th>
                  <th className="text-left py-2 px-3 text-[var(--color-text-muted)] font-medium">
                    Check-out
                  </th>
                  <th className="text-left py-2 px-3 text-[var(--color-text-muted)] font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 5).map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[var(--color-secondary)]/30 hover:bg-[var(--color-surface)]/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-[var(--color-text)]">
                      {r.responsibleName}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--color-text-light)]">
                      {new Date(r.checkInDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--color-text-light)]">
                      {new Date(r.checkOutDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    checked_in: "bg-blue-100 text-blue-700",
    checked_out: "bg-gray-100 text-gray-600",
  };
  const labels: Record<string, string> = {
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    checked_in: "Check-in",
    checked_out: "Check-out",
  };

  function normalizeStatus(status: string) {
    return status.toLowerCase().replace(/ /g, "_");
  }
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${map[normalizeStatus(status)] || "bg-gray-100"}`}
    >
      {labels[normalizeStatus(status)] || status}
    </span>
  );
}
