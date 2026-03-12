import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, Lock, User } from "lucide-react";
import { useAuth } from "@/store/auth.context";
import { useToast } from "@/store/toast.context";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { ApiError } from "@/services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ username, password });
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.status === 401 ? "Credenciais inválidas" : err.message);
      } else {
        toast.error("Erro ao conectar com o servidor");
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-secondary)]/40 overflow-hidden">
          {/* Header visual */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
              <Hotel size={32} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">
              Check<span className="text-[var(--color-surface)]">Inn</span>
            </h1>
            <p className="mt-2 text-white/70 text-sm">
              Acesse o painel de gestão
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-10 text-[var(--color-text-muted)]"
              />
              <Input
                label="Usuário"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-11"
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-10 text-[var(--color-text-muted)]"
              />
              <Input
                label="Senha"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11"
              />
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Entrar
            </Button>

            <p className="text-center text-xs text-[var(--color-text-muted)]">
              Credenciais padrão: <b>admin</b> / <b>123456</b>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
