"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import swal from "sweetalert";
import { useEffect, useState } from "react";

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

interface HandleSubmitParams {
  foodId: string;
  time: string;
  timePeriod: string;
  quantity: number;
  status?: boolean;
}

const FoodCard = ({
  details,
  addedFood,
}: {
  details: LatestDiet;
  addedFood: string[];
}) => {
  // console.log("details", details);

  const [addedFoodList, setAddedFoodList] = useState<string[]>([]);
  const [change, setChange] = useState(false);

  // useEffect(() => {
  //   const currentTime = new Date();
  //   const foodTime = new Date();
  //   const [hours, minutes] = details.time.split(":").map(Number);
  //   foodTime.setHours(hours, minutes);

  //   const timeLeft = foodTime.getTime() - currentTime.getTime();

  //   let timerId: NodeJS.Timeout;

  //   const isFoodAdded =
  //     addedFood?.includes(details.foodId._id) ||
  //     addedFoodList?.includes(details.foodId._id);

  //     console.log("isFoodAdded", isFoodAdded);

  //   if (timeLeft > 0 && !isFoodAdded) {
  //     console.log(details.foodId.foodname, "timeLeft", timeLeft);

  //     console.log('from the first if condition of timeLeft > 0 and !isFoodAdded')
  //     timerId = setTimeout(() => {
  //       handleSubmit({
  //         foodId: details.foodId._id,
  //         time: details.time,
  //         timePeriod: details.timePeriod,
  //         quantity: details.quantity,
  //         status: false,
  //       });
  //     }, timeLeft);
  //   } else if (timeLeft < 0 && !isFoodAdded) {
  //     console.log('from the second if condition of timeLeft < 0 and !isFoodAdded')
  //     handleSubmit({
  //       foodId: details.foodId._id,
  //       time: details.time,
  //       timePeriod: details.timePeriod,
  //       quantity: details.quantity,
  //       status: false,
  //     });
  //   }

  //   return () => {
  //     if (timerId) {
  //       clearTimeout(timerId);
  //     }
  //   };
  // }, [details, change]);

  const handleSubmit = async ({
    foodId,
    time,
    timePeriod,
    quantity,
    status = true,
  }: HandleSubmitParams) => {
    console.log("calling the api after the time up");
    axiosInstance
      .put("/user/addFoodLog", {
        foodId,
        time,
        timePeriod,
        quantity,
        status,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setAddedFoodList([...addedFoodList, foodId]);
          // setChange(!change);
          swal({
            title: "Yum Yum",
            text: "Food Added to your History!",
            icon: "success",
            timer: 1500,
            buttons: {},
          });
        } else {
          swal({
            title: "Oops",
            text: "Something went wrong",
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Oops",
          text: "Something went wrong",
          icon: "error",
        });
      });
  };

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
              <Badge variant="secondary">
                Carb : {details.foodId.nutrition.carbs}
              </Badge>
            </div>
            <div>
              <Badge variant="secondary">
                Protien : {details.foodId.nutrition.protein}
              </Badge>
            </div>
          </div>
          <div>
            <div>
              <Badge variant="secondary">
                {" "}
                Calorie : {details.foodId.nutrition.calories}
              </Badge>
            </div>
            <div>
              <Badge variant="secondary">
                Fat : {details.foodId.nutrition.fat}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center gap-2 space-y-5">
          <div className="p-2">
            <Badge variant="outline">Qty : {details.quantity}</Badge>
          </div>
          <div>
            <Button
              disabled={
                addedFood?.includes(details.foodId._id) ||
                addedFoodList?.includes(details.foodId._id)
              }
              onClick={() => {
                handleSubmit({
                  foodId: details.foodId._id,
                  time: details.time,
                  timePeriod: details.timePeriod,
                  quantity: details.quantity,
                });
              }}
              size={"sm"}
            >
              Yum !!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
