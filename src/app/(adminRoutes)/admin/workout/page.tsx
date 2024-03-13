import ListWorkouts from "@/components/adminRoutes/ListWorkouts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div>
      workout page
      <div className="flex justify-center">
        <Link href="/admin/workout/add">
          <Button size={"lg"} className="bg-green-200 hover:bg-green-400">
            Add Workouts
          </Button>
        </Link>
      </div>
      <h1>Workout List</h1>
      <ListWorkouts />
    </div>
  );
};

export default page;
