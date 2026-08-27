export type PaymentMethod =
  | "transferencia"
  | "efectivo"
  | "payphone";

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type ShippingInfo = {
  province: string;
  city: string;
  address: string;
  reference?: string;
};

export type CheckoutData = {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
};