export { CustomerList } from "./components/customer-list";
export { CustomerForm } from "./components/customer-form";
export { CustomerDialog } from "./components/customer-dialog";
export { CustomerCombobox } from "./components/customer-combobox";
export {
  getCustomers,
  getCustomer,
  searchCustomers,
  getCustomersCount,
} from "./services";
export {
  createCustomerAction,
  updateCustomerAction,
  deleteCustomerAction,
} from "./server-actions";
export type { Customer } from "./types";
export type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./schemas/customer.schema";
