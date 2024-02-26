import ClientDetailsFromTrainer from "@/components/trainerComponents/ClientDetailsFromTrainer";

const page = ({ params }: { params: { client_Id: string } }) => {
  return (
    <div>
      <ClientDetailsFromTrainer client_Id={params.client_Id} />
    </div>
  );
};

export default page;
