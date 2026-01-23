import { useState, type FormEventHandler } from "react";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export const Route = createFileRoute("/auth/login")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div>
      <LoginGastony />{" "}
    </div>
  );
}

export default function LoginGastony() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); 
    // aqui luego conectas con tu endpoint de Django
    const base_Url = "http://localhost:8000";

    try {
      const resp = await axios.post(`${base_Url}/login`, {
        username: email,
        password,
      });
      console.log(resp);

    //   comando que guarda el token que viene del backend en la sesion local 
      const mitoken = resp.data.token
      window.sessionStorage.setItem('token',mitoken)
      console.log(mitoken)

    //   esta es la redireccion una vez se comprueba el login
      window.location.href='/app/home'
    } catch { window.alert('Algo salio mal')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Gastony</h1>
              <p className="text-gray-500 text-sm mt-1">
                Inicia sesión y controla tus gastos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-500">
              ¿No tenés cuenta?{" "}
              <a
                href="#"
                className="text-emerald-600 font-medium hover:underline"
              >
                Registrate
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
