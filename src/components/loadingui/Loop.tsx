"use client";
import { InfinitySpin } from "react-loader-spinner";
const Loop = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <InfinitySpin width="200" color="#4fa94d" />
    </div>
  );
};

export default Loop;
