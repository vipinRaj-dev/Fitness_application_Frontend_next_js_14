"use client";
import { Bars } from "react-loader-spinner";
const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <Bars
        height="80"
        width="80"
        color="#fc1303"
        ariaLabel="bars-loading"
        visible={true}
      />
    </div>
  );
};

export default Spinner;
