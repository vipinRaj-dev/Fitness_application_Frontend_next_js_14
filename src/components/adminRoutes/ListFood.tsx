"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const ListFood = () => {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    console.log("ListFood");
    axiosInstance
      .get("/admin/food")
      .then((res) => {
        console.log(res.data);
        setFoodList(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const handleDelete = (foodId: string) => {
    console.log("delete");

    axiosInstance
      .delete(`/admin/deleteFood/${foodId}`)
      .then((res) => {
        console.log(res.data);
        setFoodList((prevFoodList) =>
        prevFoodList.filter((food: { _id: string }) => food._id !== foodId)
        );
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  return (
    <div>
      ListFood
      <Link href="/admin/food/add">
        <Button>Add food </Button>
      </Link>
      <div>
        {foodList.map((food: any, index) => (
          <div>
            {/* <img src={food.photoUrl} alt={food.name} /> */}
            <h2>{index + 1}</h2>
            <h2>{food.foodname}</h2>
            <p>{food.description}</p>
            <p>{food.foodtype}</p>
            <Link href={`/admin/food/edit/${food._id}`}>
              <Button>Edit</Button>
            </Link>
            <Button onClick={() => handleDelete(food._id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListFood;
