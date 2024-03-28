"use client";

import axiosInstance from "@/axios/creatingInstance";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = ({
  params,
}: {
  params: {
    userName: string;
    roomId: string;
  };
}) => {
  const roomId = params.roomId;

  useEffect(() => {
    try {
      axiosInstance
        .get(`/user/getUser/${roomId}`)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("videocall page error", error);
    }
  }, []);

  const router = useRouter();

  const myMeeting = async (element: any) => {
    const appID = 647511603;
    const serverSecret = "c55d687bb503f34aea67cb0b6e2952d6";

    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Enter your name"
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
      video call room {params.roomId}
      <div ref={myMeeting} />
    </div>
  );
};

export default page;
