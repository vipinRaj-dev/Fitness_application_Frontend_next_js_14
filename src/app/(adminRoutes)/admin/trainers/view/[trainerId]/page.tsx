import TrainerProfile from "@/components/adminRoutes/TrainerProfile";

const page = ({
  params,
}: {
  params: {
    trainerId: string;
  };
}) => {
  const trainerId = params.trainerId;
  // console.log("this is the Trainer id from the parmas ", trainerId);

  return (
    <div>
      view Trainer profile page
      <TrainerProfile trainerId={trainerId} />
    </div>
  );
};

export default page;
