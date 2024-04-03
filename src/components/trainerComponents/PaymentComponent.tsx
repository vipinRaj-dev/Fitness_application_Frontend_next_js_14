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
import AreaChartPlot from "../recharts/AreaChartPlot";
import LIneChartPlot from "../recharts/LIneChartPlot";
import { LineChartData } from "../recharts/LIneChartPlot";
import { AreaChartData } from "../recharts/AreaChartPlot";
import { ResponseDataTrainerPayments  , PaymentClientType} from "@/types/TrainerTypes";


const PaymentComponent = () => {
  const [payments, setPayments] = useState<PaymentClientType[]>([]);
  const [lineChartData, setLineChartData] = useState<LineChartData[] | null>(
    null
  );
  const [areaChartData, setAreaChartData] = useState<AreaChartData[] | null>(
    null
  );

  const setAllDataToStates = (data: ResponseDataTrainerPayments) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const mappedData = data.userCountPerMonth.map((item) => ({
      month: months[item._id - 1],
      usercount: item.clientCount,
    }));
    setLineChartData(mappedData);
    const areaData = data.monthlyPayments.map((item) => ({
      month: months[item._id - 1],
      totalAmount: item.totalAmount,
    }));
    setAreaChartData(areaData);
  };

  useEffect(() => {
    // fetch data
    axiosInstance
      .get("/trainer/payments")
      .then((res) => {
        console.log("res.data.trainer payments", res.data);
        setPayments(res.data.payments);
        setAllDataToStates(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="p-10">
      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[350px] bg-gray-700 rounded">
          <AreaChartPlot data={areaChartData ? areaChartData : []} />
        </div>

        <div className=" w-1/2 h-[350px] bg-gray-700 rounded">
          <LIneChartPlot data={lineChartData ? lineChartData : []} />
        </div>
      </section>
      <div>
        <h1 className="text-3xl font-semibold">Payments</h1>
      </div>
      <div>
        <Table className="rounded-lg">
          <TableCaption>Payments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Transaction Id</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Amount</TableHead>
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
                      src={payment.clientDetails.profileImage}
                      width={40}
                      height={40}
                      className="rounded-xl"
                      alt={payment.clientDetails.name}
                    />
                  </TableCell>
                  <TableCell>{payment.clientDetails.name}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentComponent;
