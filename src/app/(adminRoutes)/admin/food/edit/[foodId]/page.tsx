import SetFoodAdmin from "@/components/usercomponents/SetFoodAdmin";

const Page= ({
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

export default Page;
