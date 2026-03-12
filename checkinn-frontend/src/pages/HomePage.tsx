import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hotel,
  CalendarCheck,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/store/auth.context";
import heroBackground from "@/assets/herobackground.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Hotel,
    title: "Gestão de Hotéis",
    desc: "Cadastre e gerencie seus hotéis com informações completas, classificação por estrelas e controle de quartos.",
  },
  {
    icon: CalendarCheck,
    title: "Reservas Inteligentes",
    desc: "Sistema de reservas com validação automática de datas, controle de disponibilidade e status em tempo real.",
  },
  {
    icon: Users,
    title: "Cadastro de Hóspedes",
    desc: "Registre hóspedes com validação de CPF/Passaporte e vincule-os às reservas automaticamente.",
  },
  {
    icon: Shield,
    title: "Segurança",
    desc: "Autenticação robusta. Sem dados sensíveis expostos.",
  },
  {
    icon: Zap,
    title: "Otimize sua Recepção",
    desc: "Acelere sua recepção, evite longas filas e realize Check-ins e Checkouts com um clique.",
  },
  {
    icon: Star,
    title: "Qualidade no Suporte",
    desc: "Aqui trabalhamos com suporte de qualidade, nosso foco é entregar a melhor experiência para Hoteis e seus hóspedes.",
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="-mt-24 sm:-mt-20">
      {/* Hero */}

      <section
        className="relative w-full min-h-[85vh] flex items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 w-full flex items-center justify-center">
          <div className="max-w-2xl flex flex-col items-center text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm font-medium mb-6">
                Sistema de Gestão Hoteleira
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Gerencie seus hotéis com{" "}
              <span className="text-[var(--color-surface)]">inteligência</span>{" "}
              e <span className="text-[var(--color-accent)]">simplicidade</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg font-medium text-white/80 leading-relaxed max-w-xl"
            >
              CheckInn é a plataforma completa para gestão de hotéis. 
              Construído para otimizar sua recepção e oferecer qualidade no atendimento e
              gerenciamento eficiente, tudo em um só lugar.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex  items-center gap-2 px-7 py-3.5 rounded-full backdrop-blur-md bg-white/20 text-[var(--color-surface)] font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                {isAuthenticated ? "Ir ao Painel" : "Começar Agora"}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
              Tudo que você precisa em{" "}
              <span className="text-[var(--color-primary)]">um só lugar</span>
            </h2>
            <p className="mt-4 text-[var(--color-text-muted)] max-w-lg mx-auto">
              Uma solução completa construída com as melhores tecnologias do
              mercado.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-2xl border border-[var(--color-secondary)]/60 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                  <feat.icon
                    size={24}
                    className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-semibold text-[var(--color-text)] text-lg mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
              Pronto para começar?
            </h2>
            <p className="mt-4 text-[var(--color-text-muted)]">
              Faça login e explore todos os recursos do CheckInn.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold text-lg hover:bg-[var(--color-primary-dark)] hover:shadow-xl transition-all duration-200"
            >
              Acessar o Painel
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
