import WorkoutSearch from "@/components/trainerComponents/WorkoutSearch";

const Page= ({ params }: { params: { client_Id: string } }) => {
  return (
    <div>
      <WorkoutSearch clientId={params.client_Id} />
    </div>
  );
};

export default Page;
