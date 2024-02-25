"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Paginate from "react-paginate";
import { Button } from "@/components/ui/button";

const FoodItemsPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10);

  //   useEffect(() => {
  //     const fetchFoodItems = async () => {
  //       const response = await axios.get('/food-items', {
  //         params: {
  //           page: page + 1, // API is 1-indexed, react-paginate is 0-indexed
  //           pageSize: 10,
  //         },
  //       });

  //       setFoodItems(response.data.items);
  //       setTotalPages(response.data.totalPages);
  //     };

  //     fetchFoodItems();
  //   }, [page]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };

  return (
    <div>
      {/* Render food items here */}
      <Paginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        onPageChange={handlePageChange}
        containerClassName={"flex list-none justify-center space-x-2"}
        pageClassName={"px-3 py-2 border rounded-md hover:bg-blue-100"}
        previousClassName={"px-3 py-2 border rounded-md hover:bg-blue-100"}
        nextClassName={"px-3 py-2 border rounded-md hover:bg-blue-100"}
        activeClassName={"bg-blue-500 text-white"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );
};

export default FoodItemsPage;
