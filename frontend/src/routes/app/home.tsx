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

export default function HomePage() {
  const [loding, setLoading] = useState(true);
  const [error, setError] = useState<boolean>();
	const [errorMessage, setErrorMessage] = useState<string>();
	const [data, setData] = useState<TransactionResponse>();
	useEffect(() => {
		const apiCall = async () => {
			const token = window.sessionStorage.getItem("token");
			try {
				setLoading(true);
				const resp = await apiClient.get<TransactionResponse>(
					`/transactions/`,
					{ headers: { Authorization: `Token ${token}` } },
				);
				setData(resp.data);
				console.log(resp.data);
			} catch {
        window.alert("Algo salio mal");
        setErrorMessage("Algo salio mal");
        setError(true);
			} finally {
				setLoading(false);
			}
		};

		apiCall();
	}, []);

	// imprimir en consola el resultado
	//
	if (error) {
		return <div>Error: {errorMessage}</div>;
	}

	return (
		<>
			{loding ? (
				"cargando"
			) : (
				<div>
					Total de transacciones: {data?.count}
					<div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
						<table className="w-full text-sm text-left rtl:text-right text-body">
							<thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
								<tr>
									<th scope="col" className="px-6 py-3 font-medium">
										Id
									</th>
									<th scope="col" className="px-6 py-3 font-medium">
										Monto
									</th>
									<th scope="col" className="px-6 py-3 font-medium">
										Tipo de transaccion
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.results.map((tran) => {
									return (
										<tr className="bg-neutral-primary border-b border-default">
											<th
												scope="row"
												className="px-6 py-4 font-medium text-heading whitespace-nowrap"
											>
												{tran.id}
											</th>
											<td className="px-6 py-4">{tran.amount}</td>
											<td className="px-6 py-4">{tran.type}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}{" "}
		</>
	);
}
