import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// luego conectas este form con tu endpoint de registro en Django
		setTimeout(() => setLoading(false), 1500);
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
								Crea tu cuenta y empezá a controlar tus gastos
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre</Label>
								<Input id="name" type="text" placeholder="Tu nombre" required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="tu@email.com"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password2">Confirmar contraseña</Label>
								<Input
									id="password2"
									type="password"
									placeholder="••••••••"
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full rounded-xl"
								disabled={loading}
							>
								{loading ? "Creando cuenta..." : "Registrarme"}
							</Button>
						</form>

						<div className="text-center mt-6 text-sm text-gray-500">
							¿Ya tenés cuenta?{" "}
							<a
								href="/auth/login"
								className="text-emerald-600 font-medium hover:underline"
							>
								Iniciá sesión
							</a>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
