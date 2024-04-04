"use client";

import React, { useEffect } from "react";
import swal from "sweetalert";
import { useRouter } from "next/navigation";

const Page= () => {
  const router = useRouter();
  useEffect(() => {
    swal({
      title: "Payment canceled",
      text: "Your payment was canceled",
      icon: "error",
    }).then(() => {
      router.replace("/user");
    });
  }, []);

  return <></>;
};

export default Page;
