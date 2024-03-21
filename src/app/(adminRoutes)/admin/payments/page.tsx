"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Payment = {
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

type PaymentsResponse = Payment[];

const page = () => {
  const [payments, setPayments] = useState<PaymentsResponse>([]);

  useEffect(() => {
    try {
      axiosInstance
        .get("admin/payments")
        .then((res) => {
          setPayments(res.data.payments);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="p-10">
      <Table className="rounded-lg">
        <TableCaption>Payments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Transaction Id</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Selected Plan</TableHead>
            <TableHead>Received Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            return (
              <TableRow key={payment._id}>
                <TableCell className="font-medium truncate">
                  {payment.transactionId}
                </TableCell>
                <TableCell>
                  <img
                    src={payment.clientDetails?.profileImage}
                    width={40}
                    height={40}
                    className="rounded-xl"
                  />
                </TableCell>
                <TableCell>{payment.clientDetails?.name}</TableCell>
                <TableCell>{payment.planSelected}</TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  {new Date(payment.clientDetails?.dueDate).toLocaleDateString()}
                </TableCell>
                
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
