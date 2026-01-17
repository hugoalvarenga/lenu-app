import { CustomerList, getCustomers } from "@/features/customers";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return <CustomerList customers={customers} />;
}
