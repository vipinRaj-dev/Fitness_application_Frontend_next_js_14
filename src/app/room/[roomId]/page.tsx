"use client";

import axiosInstance from "@/axios/creatingInstance";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page= ({
  params,
}: {
  params: {
    roomId: string;
  };
}) => {
  const roomId = params.roomId;

  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    try {
      axiosInstance
        .get(`/user/getUser`)
        .then((res) => {
          console.log(res);
          setUserEmail(res.data.email);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("videocall page error", error);
    }
  }, []);

  const router = useRouter();

  const myMeeting = (element: HTMLDivElement | null) => {
    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID ?? 0);
    const serverSecret =
      process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET ?? ("" as string);

    // console.log("appID", appID);
    // console.log("serverSecret", serverSecret);
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      userEmail
    );

    const zc = ZegoUIKitPrebuilt.create(KitToken);

    zc &&
      zc.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },

        onReturnToHomeScreenClicked: () => {
          router.replace("/");
        },

        showScreenSharingButton: true,
      });
  };
  return (
    <div>
      <div ref={myMeeting} />
    </div>
  );
};

export default Page;
