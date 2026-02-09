import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

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

export const Route = createFileRoute("/app/home")({
  loader: async () => {
    const url = "http://localhost:8000";
    const token = sessionStorage.getItem("token");

    const [transactionsResp, balanceResp] = await Promise.all([
      axios.get<TransactionResponse>(`${url}/accounting/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      axios.get<{ balance: number }>(`${url}/accounting/balance`, {
        headers: { Authorization: `Token ${token}` },
      }),
    ]);

    
    return {
      transactions: transactionsResp.data,
      balance: balanceResp.data.balance,
    };
  },

  component: RouteComponent,
});
function RouteComponent() {
  const { transactions, balance } = Route.useLoaderData();

  return (
    <div>
      Total de transacciones: {transactions.count}

      <table>
        <tbody>
          {transactions.results.map((tran) => (
            <tr key={tran.id}>
              <td>{tran.id}</td>
              <td>{tran.amount}</td>
              <td>{tran.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: {balance}</h2>
    </div>
  );
}

