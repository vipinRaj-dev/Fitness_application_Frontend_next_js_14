import AllTrainer from "@/components/adminRoutes/AllTrainers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const TrainerPage = () => {
  return (
    <div>
      <h1 className="text-xl">TrainerPage</h1>

      <div>search bar</div>
      <div>sort by</div>
      <div>
        <Link href="/admin/trainers/create">
          <Button variant={"custom"} size={"sm"} className="mt-2">
            Create Trainer
          </Button>
        </Link>
      </div>
      <AllTrainer />
    </div>
  );
};

export default TrainerPage;
