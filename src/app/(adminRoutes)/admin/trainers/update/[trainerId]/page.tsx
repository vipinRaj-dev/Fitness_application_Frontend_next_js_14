import UpdateTrainer from "@/components/adminRoutes/UpdateTrainer";
import UpdateUser from "@/components/adminRoutes/UpdateUser";

const page = ({
  params,
}: {
  params: {
    trainerId: string;
  };
}) => {
  const trainerId = params.trainerId;
  // console.log("this is the trainer id from the parmas ", trainerId);

  return (
    <div> 
      view trainer update page
      <UpdateTrainer trainerId ={trainerId}/>
    </div>
  );
};

export default page;
