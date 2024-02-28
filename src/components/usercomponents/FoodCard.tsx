"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  _id: string;
}

interface Food {
  createdAt: string;
  description: string;
  foodname: string;
  foodtype: string;
  ingredients: string[];
  nutrition: Nutrition;
  photoUrl: string;
  publicId: string;
  quantity: number;
  unit: string;
  __v: number;
  _id: string;
}

interface Diet {
  date: string;
  foodId: Food;
  quantity: number;
  time: string;
  timePeriod: string;
  _id: string;
}

type LatestDiet = Diet;
const FoodCard = ({ details }: { details: LatestDiet }) => {
  console.log("details", details);
  return (
    <div className="bg-slate-900 p-3 rounded-lg md:flex ">
      <div className="md:w-44 ">
        <img className="rounded-2xl" src="/images/food1.png" alt="food" />
      </div>

      <div>
        <div className="flex justify-between items-center p-2">
          <div>
            <h1 className="font-semibold text-xl">{details.foodId.foodname}</h1>
          </div>
          <div>
            <p className="text-sm font-light">Before : {details.time}</p>
          </div>
        </div>

        <div className="flex justify-around">
          <div>
            <div>
              <Badge variant="secondary">Carb : {details.foodId.nutrition.carbs}</Badge>
            </div>
            <div>
              <Badge variant="secondary">Protien : {details.foodId.nutrition.protein}</Badge>
            </div>
          </div>
          <div>
            <div>
              <Badge variant="secondary"> Calorie : {details.foodId.nutrition.calories}</Badge>
            </div>
            <div>
              <Badge variant="secondary">Fat : {details.foodId.nutrition.fat}</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center gap-2 space-y-5">
          <div className="p-2">
            <Badge variant="outline">Qty : {details.foodId.quantity}</Badge>
          </div>
          <div>
            <Button size={"sm"}>Yum !!</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
