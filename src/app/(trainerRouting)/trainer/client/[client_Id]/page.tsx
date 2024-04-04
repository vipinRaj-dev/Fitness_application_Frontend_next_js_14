import ClientDetailsFromTrainer from "@/components/trainerComponents/ClientDetailsFromTrainer";

const Page= ({ params }: { params: { client_Id: string } }) => {
  return (
    <div>
      <ClientDetailsFromTrainer client_Id={params.client_Id} />
    </div>
  );
};

export default Page;
