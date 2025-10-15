import { useState, useEffect } from "react";
import { HiPhone } from "react-icons/hi";
import NavBar from "./NavBar";
import { createNewCall, enqueueCall, updateCallStatus } from "../services/callService";

type CallStatus = "idle" | "ringing" | "in-queue" | "answered" | "hung-up";

function CallCenter() {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [callSid, setCallSid] = useState<string>("");
  const [fromNumber, setFromNumber] = useState("+380501234567");
  const [toNumber, setToNumber] = useState("+380509876543");
  const [error, setError] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  const statusSteps: CallStatus[] = [
    "ringing",
    "in-queue",
    "answered",
    "hung-up",
  ];

  const statusLabels = {
    idle: "Ready",
    ringing: "Ringing",
    "in-queue": "In Queue",
    answered: "Answered",
    "hung-up": "Hung Up",
  };

  const statusColors = {
    idle: "bg-gray-400",
    ringing: "bg-yellow-500",
    "in-queue": "bg-blue-500",
    answered: "bg-green-500",
    "hung-up": "bg-gray-500",
  };

  useEffect(() => {
    if (callStatus === "idle") {
      setProgress(0);
      return;
    }
    const currentIndex = statusSteps.indexOf(callStatus);
    if (currentIndex >= 0) {
      setProgress(((currentIndex + 1) / statusSteps.length) * 100);
    }
  }, [callStatus]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "answered") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartCall = async () => {
    try {
      setLoading(true);
      setError("");
      setCallDuration(0);
      setQueuePosition(null);

      // Step 1: Create new call
      setCallStatus("ringing");
      const newCallResponse = await createNewCall({
        from: fromNumber,
        to: toNumber,
      });
      setCallSid(newCallResponse.callSid);

      // Step 2: Enqueue call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCallStatus("in-queue");
      await enqueueCall();
      setQueuePosition(Math.floor(Math.random() * 5) + 1);

      // Step 3: Answer call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCallStatus("answered");
      await updateCallStatus({
        callSid: newCallResponse.callSid,
        callStatus: "answered",
      });

      // Step 4: Auto hang up after some time (demo)
      await new Promise((resolve) => setTimeout(resolve, 8000));
      setCallStatus("hung-up");
      await updateCallStatus({
        callSid: newCallResponse.callSid,
        callStatus: "completed",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to process call"
      );
      setCallStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleHangUp = async () => {
    if (!callSid) return;

    try {
      setLoading(true);
      await updateCallStatus({ callSid, callStatus: "completed" });
      setCallStatus("hung-up");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to hang up call");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCallStatus("idle");
    setProgress(0);
    setCallSid("");
    setCallDuration(0);
    setQueuePosition(null);
    setError("");
  };

  const getCurrentStepIndex = () => {
    if (callStatus === "idle") return -1;
    return statusSteps.indexOf(callStatus);
  };

  const isCallActive = callStatus !== "idle" && callStatus !== "hung-up";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activeMenu="call-center" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Call Center</h1>
          <p className="text-gray-600 mb-8">
            Monitor your call progress in real-time
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Phone Number Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Number
              </label>
              <input
                type="tel"
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                disabled={isCallActive || loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                placeholder="+380501234567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Number
              </label>
              <input
                type="tel"
                value={toNumber}
                onChange={(e) => setToNumber(e.target.value)}
                disabled={isCallActive || loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                placeholder="+380509876543"
              />
            </div>
          </div>

          {callStatus !== "idle" && (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${statusColors[callStatus]}`}
                    />
                  </div>
                  <div className="text-right text-sm font-medium text-gray-600">
                    {progress.toFixed(0)}% Complete
                  </div>
                </div>
              </div>

              {/* Status Steps */}
              <div className="mb-8">
                <div className="flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index === getCurrentStepIndex();
                    const isCompleted = index < getCurrentStepIndex();

                    return (
                      <div key={step} className="flex-1 text-center">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                              isActive
                                ? `${statusColors[callStatus]} text-white scale-110 shadow-lg`
                                : isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-500"
                            }`}
                          >
                            {isCompleted ? (
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-lg font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isActive || isCompleted
                                ? "text-gray-800"
                                : "text-gray-500"
                            }`}
                          >
                            {statusLabels[step]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Status Display */}
              <div
                className={`p-6 rounded-lg mb-6 ${
                  statusColors[callStatus]
                } bg-opacity-10 border-2 ${statusColors[callStatus].replace(
                  "bg-",
                  "border-"
                )}`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <HiPhone
                    className={`w-8 h-8 ${statusColors[callStatus].replace(
                      "bg-",
                      "text-"
                    )}`}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p
                      className={`text-2xl font-bold ${statusColors[
                        callStatus
                      ].replace("bg-", "text-")}`}
                    >
                      {statusLabels[callStatus]}
                    </p>
                  </div>
                </div>
                {callSid && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Call SID: {callSid}
                  </p>
                )}
              </div>

              {/* Call Info */}
              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Call Duration</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {callStatus === "answered" || callStatus === "hung-up"
                      ? formatDuration(callDuration)
                      : "--:--"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Queue Position</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {queuePosition !== null ? `#${queuePosition}` : "--"}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {callStatus === "idle" ? (
              <button
                onClick={handleStartCall}
                disabled={loading || !fromNumber || !toNumber}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Starting Call..." : "Start New Call"}
              </button>
            ) : callStatus === "hung-up" ? (
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
              >
                Start Another Call
              </button>
            ) : (
              <button
                onClick={handleHangUp}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-md disabled:opacity-50"
              >
                {loading ? "Hanging Up..." : "Hang Up"}
              </button>
            )}

            {callStatus !== "idle" && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallCenter;
