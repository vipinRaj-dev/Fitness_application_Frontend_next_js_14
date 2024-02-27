"use client";
import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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
        // console.log(res.data);
        if (res.status === 200) {
          setAddedFoodId((prev) => prev.filter((id) => id !== foodId));
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  }
  return (
    <div>
      FoodSearch {clientId}
      {foodList.map((food: Food, index) => {
        return (
          <div key={food._id}>
            <h1>Number : {index + 1}</h1>
            <h1>{food.foodname}</h1>
            <h2>{food.description}</h2>
            <h3>Type: {food.foodtype}</h3>
            <h4>Ingredients: {food.ingredients.join(", ")}</h4>
            <h4>Nutrition:</h4>
            <p>Calories: {food.nutrition.calories}</p>
            <p>Protein: {food.nutrition.protein}</p>
            <p>Carbs: {food.nutrition.carbs}</p>
            <p>Fat: {food.nutrition.fat}</p>
            <p>
              Quantity: {food.quantity} {food.unit}
            </p>
            <img
              className="w-20 h-20 rounded-full"
              src={food.photoUrl}
              alt={food.foodname}
            />

            {addedFoodId.includes(food._id) ? (
              <Button onClick={() => deleteFood(food._id)}>Delete Food</Button>
            ) : (
              <Button onClick={() => addFood(food._id)}>Add Food</Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FoodSearch;
