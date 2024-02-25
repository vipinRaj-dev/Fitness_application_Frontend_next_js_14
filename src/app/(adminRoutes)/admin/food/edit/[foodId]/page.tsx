import SetFoodAdmin from "@/components/usercomponents/SetFoodAdmin";

const page = ({
  params,
}: {
  params: {
    foodId: string;
  };
}) => {
  return <div>edit food page with the id {params.foodId}
  
  <SetFoodAdmin foodId= {params.foodId} />
    </div>;
};

export default page;
  