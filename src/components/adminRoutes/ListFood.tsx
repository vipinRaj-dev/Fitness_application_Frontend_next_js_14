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
    <div className="p-16">
      <div className="flex justify-end">
        <Link href="/admin/food/add">
          <Button className="bg-green-200 hover:bg-green-400">Add food </Button>
        </Link>
      </div>
      <div className="p-5">
        {foodList.map((food: any) => (
          <div
            className="flex gap-2 mb-4 h-36 p-3 bg-[#2C2C2E] rounded-lg justify-between items-center"
            key={food._id}
          >
            <div className="flex gap-3 h-full">
              <div className="rounded-3xl w-32  overflow-hidden">
                <img
                  className="w-full h-full object-contain "
                  src={food.photoUrl}
                  alt={food.name}
                />
              </div>
              <div className=" h-full overflow-auto scrollbar-none">
                <div>
                  <h1 className="text-xl font-semibold">{food.foodname}</h1>
                </div>

                <div className="flex gap-2 text-green-300 font-extralight">
                  <p>Ingredients : </p>
                  {food.ingredients.map((ingredient: any, index: number) => {
                    return <p key={index}>{ingredient}</p>;
                  })}
                </div>

                <div className="  w-96">{food.description}</div>
              </div>
            </div>

            <div>
              {food && food.nutrition ? (
                Object.entries(food.nutrition).map(([key, value]) => {
                  if (typeof value === "number" && value !== 0) {
                    return (
                      <div key={key}>
                        <h1>
                          {key} : {value}
                        </h1>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <p>No nutrition information available.</p>
              )}
            </div>
            <div>
              <Link href={`/admin/food/edit/${food._id}`}>
                <Button className="rounded-3xl bg-green-400 hover:bg-green-500">
                  Edit
                </Button>
              </Link>
              <Button
                className="ml-2 rounded-3xl bg-green-500 hover:bg-green-400"
                onClick={() => handleDelete(food._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListFood;
