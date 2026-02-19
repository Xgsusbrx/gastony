import { apiClient } from '@/api'
import { useEffect, useState } from "react";

export interface TransactionResponse {
	count: number;
	next: null;
	previous: null;
	results: Result[];
}

export interface Result {
	id: number;
	amount: string;
	notes: string;
	currency: null | string;
	type: string;
	category: number | null;
	user: number;
}

const typeConfig: Record<string, { label: string; className: string }> = {
	income:   { label: "Ingreso",   className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
	expense:  { label: "Gasto",     className: "text-red-400 bg-red-400/10 border-red-400/20" },
	transfer: { label: "Transfer",  className: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
};

function TypeBadge({ type }: { type: string }) {
	const cfg = typeConfig[type.toLowerCase()] ?? {
		label: type,
		className: "text-slate-400 bg-slate-400/10 border-slate-400/20",
	};
	return (
		<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
			<span className="w-1.5 h-1.5 rounded-full bg-current" />
			{cfg.label}
		</span>
	);
}

function formatAmount(amount: string) {
	const num = parseFloat(amount);
	if (isNaN(num)) return amount;
	return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(num);
}

export default function HomePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [data, setData] = useState<TransactionResponse | null>(null);

	useEffect(() => {
		const apiCall = async () => {
			const token = window.sessionStorage.getItem("token");
			try {
				setLoading(true);
				const resp = await apiClient.get<TransactionResponse>(
					`/accounting/`,
					{ headers: { Authorization: `Token ${token}` } },
				);
				setData(resp.data);
			} catch (err) {
				console.error("❌ Error:", err);
				setErrorMessage("Algo salió mal al cargar las transacciones.");
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		apiCall();
	}, []);

	if (error) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
				<div className="text-center bg-slate-900 border border-red-500/20 rounded-2xl p-10 max-w-sm w-full">
					<p className="text-4xl mb-3">⚠️</p>
					<p className="text-red-400 font-semibold text-lg mb-1">Algo salió mal</p>
					<p className="text-slate-500 text-sm">{errorMessage}</p>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500 text-sm">
				<svg className="animate-spin w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
				</svg>
				Cargando transacciones...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 flex justify-center p-6 sm:p-12">
			<div className="w-full max-w-3xl">

				{/* Header */}
				<div className="mb-8">
					<p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-2">
						Panel financiero
					</p>
					<h1 className="text-3xl font-bold text-slate-100 tracking-tight">
						Transacciones
					</h1>
					<p className="text-slate-500 text-sm mt-1">
						Historial completo de movimientos de tu cuenta
					</p>
				</div>

				{/* Stat cards */}
				<div className="grid grid-cols-2 gap-4 mb-6">
					<div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5">
						<p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
							Total transacciones
						</p>
						<p className="text-3xl font-bold text-slate-100 tracking-tight">
							{data?.count ?? 0}
						</p>
					</div>
					<div className="bg-slate-900 border border-indigo-500/20 rounded-2xl px-6 py-5">
						<p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
							Mostrando
						</p>
						<p className="text-3xl font-bold text-indigo-400 tracking-tight">
							{data?.results?.length ?? 0}
						</p>
					</div>
				</div>

				{/* Table card */}
				<div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

					{/* Table head */}
					<div className="grid grid-cols-[56px_1fr_150px_120px] px-6 py-3 bg-slate-950 border-b border-slate-800">
						{["#", "Notas", "Monto", "Tipo"].map((h) => (
							<span key={h} className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
								{h}
							</span>
						))}
					</div>

					{/* Rows */}
					{data?.results && data.results.length > 0 ? (
						data.results.map((tran, i) => (
							<div
								key={tran.id}
								className={`grid grid-cols-[56px_1fr_150px_120px] px-6 py-4 items-center border-b border-slate-800/60 last:border-0 transition-colors hover:bg-slate-800/50 ${
									i % 2 !== 0 ? "bg-slate-800/20" : ""
								}`}
							>
								<span className="text-xs text-slate-500 font-mono">
									#{tran.id}
								</span>
								<span className="text-sm text-slate-400 truncate pr-4">
									{tran.notes || <em className="text-slate-600 not-italic">Sin notas</em>}
								</span>
								<span className="text-sm font-semibold text-slate-200 font-mono">
									{formatAmount(tran.amount)}
								</span>
								<TypeBadge type={tran.type} />
							</div>
						))
					) : (
						<div className="text-center py-16 text-slate-500 text-sm">
							<p className="text-3xl mb-2">📭</p>
							<p>No hay transacciones para mostrar</p>
						</div>
					)}
				</div>

			</div>
		</div>
	);
}