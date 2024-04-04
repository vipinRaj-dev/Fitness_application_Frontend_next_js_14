"use client";

import AreaChartPlot from "./AreaChartPlot";
import BarChartPlot, { BarChartData } from "./BarChartPlot";
import PieChartPlot from "./PieChartPlot";
import LIneChartPlot from "./LIneChartPlot";
import RadarChartPlot from "./RadarChartPlot";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios/creatingInstance";
import { LineChartData } from "./LIneChartPlot";
import { AreaChartData } from "./AreaChartPlot";
import { pieChartData } from "./PieChartPlot";

import { AdminDashResponseData } from "@/types/DateWiseResponseTypes";

// type numericResponse = {
//   totalRevenue: number;
//   premiumUsers: number;
//   trialUsers: number;
//   trialExpired: number;
//   totalTrainers: number;
// } | null;

const Charts = () => {
  const [numericalData, setNumericalData] = useState<AdminDashResponseData>();

  const [lineChartData, setLineChartData] = useState<LineChartData[] | null>(
    null
  );

  const [areaChartData, setAreaChartData] = useState<AreaChartData[] | null>(
    null
  );

  const [pieChartData, setPieChartData] = useState<pieChartData[] | null>(null);

  const [BarChartData, setBarChartData] = useState<BarChartData[] | null>(null);

  const setAllDataToStates = (data: AdminDashResponseData) => {
    setNumericalData(data);
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
      usercount: item.count,
    }));
    setLineChartData(mappedData);

    const areaData = data.monthlyPayments.map((item) => ({
      month: months[item._id - 1],
      totalAmount: item.totalAmount,
    }));
    setAreaChartData(areaData);

    const pieData = data.foodCountWithFoodtype.map((item) => ({
      type: item._id,
      count: item.count,
    }));
    setPieChartData(pieData);
    const barData = data.trainerWiseClientCount.map((item) => ({
      name: item.name,
      clientCount: item.clientCount,
    }));
    setBarChartData(barData);
  };

  useEffect(() => {
    try {
      axiosInstance
        .get("/admin/graph")
        .then((res) => {
          // console.log("res.data.chats =========", res.data);
          setAllDataToStates(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <section>
        <div className="flex m-4 gap-4">
          <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded max-h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Total Revenue</p>
              <p className="py-4 font-bold">${numericalData?.totalRevenue} </p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded max-h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Premium Users</p>
              <p className="py-4 font-bold">{numericalData?.premiumUsers} </p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded h-300px">
            <div>
              <p className="text-gray-900 font-bold">Trial Users</p>
              <p className="py-4 font-bold ">{numericalData?.trialUsers} </p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded h-300px">
            <div>
              <p className="text-gray-900 font-bold">
                Trial Expired and Not Premium
              </p>
              <p className="py-4 font-bold ">{numericalData?.trialExpired} </p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded h-300px">
            <div>
              <p className="text-gray-900 font-bold">Total Trainers</p>
              <p className="py-4 font-bold ">{numericalData?.totalTrainers} </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[350px] bg-gray-700 rounded">
          <AreaChartPlot data={areaChartData ? areaChartData : []} />
        </div>

        <div className=" w-1/2 h-[350px] bg-gray-700 rounded">
          <LIneChartPlot data={lineChartData ? lineChartData : []} />
        </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <PieChartPlot data={pieChartData ? pieChartData : []} />
        </div>
        <div className="w-2/3 h-[400px] bg-gray-700 rounded">
          <BarChartPlot data={BarChartData ? BarChartData : []} />
        </div>
        {/* <div className=" w-1/3 h-[250px] bg-gray-700 rounded">
          <RadarChartPlot />
        </div> */}
      </section>
    </>
  );
};

export default Charts;
