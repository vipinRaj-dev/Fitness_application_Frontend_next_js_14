import UpdateTrainer from "@/components/adminRoutes/UpdateTrainer";
import UpdateUser from "@/components/adminRoutes/UpdateUser";

const page = ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const userId = params.userId;
  // console.log("this is the trainer id from the parmas ", userId);

  return (
    <div>
      <UpdateUser userId={userId} />
    </div>
  );
};

export default page;
