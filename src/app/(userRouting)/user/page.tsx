import { Switch } from "@/components/ui/switch"


const Userpage = () => {
  return (
    <div>
     <div className="flex justify-end p-3">
     <h1 className="mx-2">Workouting</h1>
     <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500" />
     </div>
      <div className="bg-slate-400 w-full ">
        <div className="h-96 mt-8">Details
        for chart implementation</div>
      </div>
      <div>
        for check bmi and other details
      </div>
      <div>
        for water bottle detils
      </div>
      <div>
        Diet plan
      </div>
      <div>
        dumbel image
      </div>
      <div>
        excersice plan
      </div>
      <div>
        pricing plan
      </div>
      
    </div>
  );
};

export default Userpage;
