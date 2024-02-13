"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { Button } from "../ui/button";

type AdminType = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  userCount: number;
  trainerCount: number;
};

const AdminLayout = () => {
  const [adminData, setAdminData] = React.useState<AdminType | null>(null);
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
    <div>
      <h1> Admin Layout wrapper</h1>

      {adminData && <h1>{adminData.fullName}</h1>}
      {adminData && <h1>{adminData.email}</h1>}
      {adminData && <h1>{adminData.role}</h1>}
      {adminData && <h1>{adminData._id}</h1>}
      {adminData && <h1>user count : {adminData.userCount}</h1>}
      {adminData && <h1>trainer count : {adminData.trainerCount}</h1>}
      <h1>header</h1>
      <h1>sidebar</h1>
      <Link href="/admin">
        <Button>dashboard</Button>
      </Link>
      <Link href="/admin/users">
        <Button>Users</Button>
      </Link>
      <h1> Admin Layout wrapper</h1>
    </div>
  );
};

export default AdminLayout;
