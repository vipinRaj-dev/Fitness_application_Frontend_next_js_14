import ListWorkouts from "@/components/adminRoutes/ListWorkouts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page= () => {
  return (
    <div>
      <div className="flex h-32 justify-center items-center">
        <Link href="/admin/workout/add">
          <Button size={"lg"} className="bg-green-200 hover:bg-green-400">
            Add Workouts
          </Button>
        </Link>
      </div>

      <ListWorkouts />
    </div>
  );
};

export default Page;
