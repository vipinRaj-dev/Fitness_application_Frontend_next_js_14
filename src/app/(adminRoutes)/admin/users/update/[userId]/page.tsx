import UpdateUser from "@/components/adminRoutes/UpdateUser";

const page = ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const userId = params.userId;
  console.log("this is the user id from the parmas ", userId);

  return (
    <div>
      view user update page
      <UpdateUser userId ={userId}/>
    </div>
  );
};

export default page;
