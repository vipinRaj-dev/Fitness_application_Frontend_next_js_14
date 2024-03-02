"use client";
import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

type Food = {
  _id: string;
  createdAt: string;
  description: string;
  foodname: string;
  foodtype: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    _id: string;
  };
  photoUrl: string;
  publicId: string;
  quantity: number;
  unit: string;
  added?: boolean;
};

const FoodSearch = ({ clientId }: { clientId: string }) => {
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [addedFoodId, setAddedFoodId] = useState<string[]>([]);

  useEffect(() => {
    // console.log(clientId);
    axiosInstance
      .get(`/trainer/allFood/${clientId}`)
      .then((res) => {
        // console.log(res.data);
        setFoodList(res.data.allFood);
        setAddedFoodId((prev) => [...prev, ...res.data.listOfFood]);
        // console.log(res.data.listOfFood);
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  }, [clientId]);

  const addFood = (foodId: string) => {
    axiosInstance
      .post(`/trainer/addFood/${clientId}`, { foodId })
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          setAddedFoodId((prev) => [...prev, res.data.foodId]);
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  };

  const deleteFood = (foodId: string) => {
    axiosInstance
      .delete(`/trainer/deleteFood/${clientId}/${foodId}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setAddedFoodId((prev) => prev.filter((id) => id !== foodId));
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  return (
    <div className="p-16">
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
              {addedFoodId.includes(food._id) ? (
                <Button
                  className="rounded-3xl bg-green-400 hover:bg-green-500"
                  onClick={() => deleteFood(food._id)}
                >
                  Delete Food
                </Button>
              ) : (
                <Button
                  className="rounded-3xl bg-green-400 hover:bg-green-500"
                  onClick={() => addFood(food._id)}
                >
                  Add Food
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSearch;
