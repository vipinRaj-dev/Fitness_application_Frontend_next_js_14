import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const FoodCard = () => {
  return (
    <div className="bg-slate-900 p-3 rounded-lg md:flex ">
      <div className="md:w-44 ">
        <img className="rounded-2xl" src="/images/food1.png" alt="food" />
      </div>

      <div>
        <div className="flex justify-between p-3">
          <div>
            <h1 className="font-semibold text-2xl">Biriyani</h1>
          </div>
          <div>
            <p className="text-sm font-light">9:00 am - 10:00 am</p>
          </div>
        </div>

        <div className="flex justify-around">
          <div>
            <div>
              <Badge variant="secondary">Carb : 2900</Badge>
            </div>
            <div>
              <Badge variant="secondary">Protien : 2900</Badge>
            </div>
          </div>
          <div>
            <div>
              <Badge variant="secondary"> Calorie : 2900</Badge>
            </div>
            <div>
              <Badge variant="secondary">Fat : 2900</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center gap-2 space-y-5">
          <div className="p-2">
            <Badge variant="outline">Qty : 5</Badge>
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
