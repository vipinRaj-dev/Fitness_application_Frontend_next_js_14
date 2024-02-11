"use client";


import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AdminStore } from "@/store/admin";
import { useRouter } from "next/navigation";
import Link from "next/link";
const AdminHomePage = () => {
  const adminDetails = AdminStore((state: AdminStore) => state.admin);
  const setAdmin = AdminStore((state: AdminStore) => state.setAdmin);
  const [counts, setCounts] = useState({ userCount: 0, trainerCount: 0 });
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      let token = Cookies.get("jwttoken");
      if (!token) {
        router.push("/sign-in");
        return;
      }
      try {
        const res = await axios.get(`${baseUrl}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        if (res.data) {
          setCounts((prevCounts) => ({
            ...prevCounts,
            userCount: res.data.userCount,
            trainerCount: res.data.trainerCount,
          }));
          res.data.adminDetails && setAdmin(res.data.adminDetails);
        }
      } catch (err: Error | any) {
        console.log(err);
        setError(err.message);
      } finally {
      }
    };

    fetchData();
  }, [setAdmin]);

 

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      AdminHomePage
      <h1>{adminDetails.fullName}</h1>
      <h1>{adminDetails.email}</h1>
      <h1>{adminDetails.role}</h1>
      <h1>{adminDetails._id}</h1>
      <h1> Trainers count: {counts.trainerCount}</h1>
      <h1> Users count: {counts.userCount}</h1>
      <Link href="/admin/users">
        Users
      </Link>
      <Link href="/admin/profile">
        AdminProfile
      </Link>
    </div>
  );
};

export default AdminHomePage;
