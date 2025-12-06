export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  billToName: string;
  billToAddress: string;
  items: InvoiceItem[];
  notes: string;
  deliveryFee: number;
  discount: number;
  headerImage?: string;
  footerImage?: string;
}