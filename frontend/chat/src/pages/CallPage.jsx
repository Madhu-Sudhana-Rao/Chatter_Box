import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const clientRef = useRef(null);
  const callRef = useRef(null);

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);

  const { authUser, isLoading: isAuthLoading } = useAuthUser();

  useEffect(() => {
    if (!isAuthLoading && !authUser) {
      navigate("/login");
    }
  }, [authUser, isAuthLoading, navigate]);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !isAuthLoading && !!authUser,
    retry: false,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) {
        console.warn("Missing auth, token, or call ID.");
        setIsConnecting(false);
        return;
      }

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({ apiKey: STREAM_API_KEY });
        clientRef.current = videoClient;

        await videoClient.connectUser(user, tokenData.token);
        const callInstance = videoClient.call("default", callId);

        callRef.current = callInstance;

        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
        setHasJoined(true);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      if (clientRef.current) {
        clientRef.current
          .disconnectUser()
          .catch((err) => console.warn("Disconnect error:", err));
      }
    };
  }, [tokenData, authUser, callId]);

  if (isAuthLoading || isConnecting) return <PageLoader />;

  if (!client || !call || !hasJoined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Could not initialize call. Please refresh or try again later.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-base-100">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  const [hasEverJoined, setHasEverJoined] = useState(false);

  useEffect(() => {
    console.log("📞 Call state:", callingState);

    if (callingState === CallingState.JOINED) {
      setHasEverJoined(true);
    }

    if (callingState === CallingState.LEFT && hasEverJoined) {
      setTimeout(() => navigate("/"), 1000);
    }
  }, [callingState, hasEverJoined, navigate]);

  return (
    <StreamTheme>
      <div className="flex flex-col h-full">
        <SpeakerLayout />
        <CallControls />
      </div>
    </StreamTheme>
  );
};

export default CallPage;
