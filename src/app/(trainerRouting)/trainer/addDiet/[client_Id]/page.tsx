import FoodSearch from "@/components/trainerComponents/FoodSearch";

const page = ({ params }: { params: { client_Id: string } }) => {
  return (
    <div>
      <FoodSearch clientId={params.client_Id} />
    </div>
  );
};

export default page;
