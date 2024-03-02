import SetFoodAdmin from "@/components/usercomponents/SetFoodAdmin";

const page = ({
  params,
}: {
  params: {
    foodId: string;
  };
}) => {
  return (
    <div>
      <SetFoodAdmin foodId={params.foodId} />
    </div>
  );
};

export default page;
