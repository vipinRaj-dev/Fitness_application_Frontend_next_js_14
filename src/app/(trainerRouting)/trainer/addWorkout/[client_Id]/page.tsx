import WorkoutSearch from "@/components/trainerComponents/WorkoutSearch";

const page = ({ params }: { params: { client_Id: string } }) => {
  return (
    <div>
      <WorkoutSearch clientId={params.client_Id} />
    </div>
  );
};

export default page;
