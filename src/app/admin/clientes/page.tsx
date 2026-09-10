import { getCustomers } from "./customer-actions";
import { CustomersManager } from "./customers-manager";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const response = await getCustomers();

  if (!response.success) {
    throw new Error(
      response.error ??
        "No se pudieron cargar los clientes.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Clientes
        </h1>

        <p className="mt-2 text-muted-foreground">
          Consulta los clientes y su historial de
          pedidos.
        </p>
      </div>

      <CustomersManager
        customers={response.customers ?? []}
      />
    </div>
  );
}