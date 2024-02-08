"use client";
import { Bars } from "react-loader-spinner";
const Spinner = () => {
  return (
    <div>
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
