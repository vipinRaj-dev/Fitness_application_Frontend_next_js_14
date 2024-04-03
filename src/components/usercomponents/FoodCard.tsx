"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import swal from "sweetalert";
import { useEffect, useState } from "react";

import { DietFoodType } from "@/types/FoodTypes";
import { HttpStatusCode } from "@/types/HttpStatusCode";



interface HandleSubmitParams {
  time: string;
  foodDocId: string;
}

const FoodCard = ({
  details,
  addedFoodDocIds,
  attendanceId
}: {
  details: DietFoodType;
  addedFoodDocIds: string[];
  attendanceId : string
}) => {
  // console.log("details", details);

  const [addedFoodDocIdsList, setAddedFoodDocIdsList] = useState<string[]>([]);
  // const [change, setChange] = useState(false);

  useEffect(() => {
    setAddedFoodDocIdsList(addedFoodDocIds); 
  }, [addedFoodDocIds]);

  const handleSubmit = async ({ time, foodDocId }: HandleSubmitParams) => {
    axiosInstance
      .put("/user/addFoodLog", {
        time,
        foodDocId,
        attendanceId
      })
      .then((res) => {
        // console.log(res);
        if (res.status === HttpStatusCode.OK) {
          setAddedFoodDocIdsList([...addedFoodDocIdsList, foodDocId]);
          // setChange(!change);
          swal({
            title: "Yum Yum",
            text: "Food Added to your History!",
            icon: "success",
            timer: 1500,
            buttons: {},
          });
        } else if (res.status === HttpStatusCode.BAD_REQUEST) {
          swal({
            title: "Oops",
            text: "You are not reached the time to eat this food",
            icon: "warning",
            timer: 1500,
            buttons: {},
          });
        }else if (res.status === HttpStatusCode.BAD_REQUEST) {
          swal({
            title: "Oops",
            text: "You can't eat this food now, You are Late",
            icon: "warning",
            timer: 1500,
            buttons: {},
          });
        }
         else {
          swal({
            title: "Oops",
            text: "Something went wrong",
            icon: "error",
            timer: 1500,
            buttons: {},
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

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":");
    const hrs = Number(hours);
    const period = hrs >= 12 ? "PM" : "AM"; 
    const hrs12 = hrs > 12 ? hrs - 12 : hrs;

    return `${hrs12 === 0 ? 12 : hrs12}:${minutes} ${period}`;
  };

  const isFoodTimeGreater = (foodTimeStr: string, detailsDocId: string) => {
    const currentTime = new Date();
    const foodTime = new Date();

    const [hours, minutes] = foodTimeStr.split(":").map(Number);
    foodTime.setHours(hours, minutes);

    if (detailsDocId && addedFoodDocIdsList.includes(detailsDocId)) {
      return false;
    }

    return foodTime.getTime() < currentTime.getTime();
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
            <p className="text-sm font-light">
              Before : {formatTime(details.time)}
            </p>
          </div>
        </div>
        <h1 className="text-center mb-1">
          approx :{details.foodId.quantity} {details.foodId.unit}{" "}
        </h1>
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
                isFoodTimeGreater(details.time, details._id) ||
                addedFoodDocIdsList.includes(details._id)
              }
              onClick={() => {
                handleSubmit({
                  time: details.time,
                  foodDocId: details._id,
                });
              }}
              size={"sm"}
            >
              {isFoodTimeGreater(details.time, details._id)
                ? "You Missed"
                : addedFoodDocIdsList.includes(details._id)
                ? "Eated"
                : "Yum !!"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
