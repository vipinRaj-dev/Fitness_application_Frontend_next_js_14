"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import React, { useEffect, useState } from "react";

type AdminType = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  userCount: number;
  trainerCount: number;
};

const AdminLayout = () => {
  const [adminData, setAdminData] = useState<AdminType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`${baseUrl}/admin/dashboard`)
          .then((res) => {
            setAdminData({
              ...{ ...res.data.adminDetails },
              userCount: res.data.userCount,
              trainerCount: res.data.trainerCount,
            });
            console.log(res.data);
          })
          .catch((error) => {
            console.log("error inside the adminLayout", error);
          });
      } catch (err: Error | any) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div >
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to my dashboard!</h1>
        <p className="mt-2 text-gray-600">
          This is an example dashboard using Tailwind CSS.
        </p>
        {adminData && <h1>{adminData.fullName}</h1>}
        {adminData && <h1>{adminData.email}</h1>}
        {adminData && <h1>{adminData.role}</h1>}
        {adminData && <h1>{adminData._id}</h1>}
        {adminData && <h1>user count : {adminData.userCount}</h1>}
        {adminData && <h1>trainer count : {adminData.trainerCount}</h1>}
      </div>
    </div>
  );
};

export default AdminLayout;
