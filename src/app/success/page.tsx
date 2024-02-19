"use client";

import React, { useEffect } from "react";
import swal from "sweetalert";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    swal({
      title: "Payment Successful",
      text: "Your payment was successful",
      icon: "success",
    }).then(() => {
      router.replace("/user");
    });
  }, []);

  return <></>;
};

export default page;
