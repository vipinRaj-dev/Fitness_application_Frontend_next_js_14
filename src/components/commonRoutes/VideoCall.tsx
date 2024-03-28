"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = ({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) => {
  useEffect(() => {
    try {
      axiosInstance
        .get(`/user/getUser/${userId}`)
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
      userId,
      Date.now().toString(),
      userName
    );

    const zc = ZegoUIKitPrebuilt.create(KitToken);

    zc &&
      zc.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
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

export default VideoCall;
