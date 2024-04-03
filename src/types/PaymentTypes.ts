export type PaymentsResponse = {
  clientDetails: {
    _id: string;
    name: string;
    email: string;
    dueDate: string;
    profileImage: string;
  };
  amount: number;
  createdAt: string;
  planSelected: string;
  receiptUrl: string;
  transactionId: string;
  _id: string;
};
