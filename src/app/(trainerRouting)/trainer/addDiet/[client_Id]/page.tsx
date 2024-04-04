import FoodSearch from "@/components/trainerComponents/FoodSearch";

const Page= ({ params }: { params: { client_Id: string } }) => {
  return (
    <div>
      <FoodSearch clientId={params.client_Id} />
    </div>
  );
};

export default Page;
