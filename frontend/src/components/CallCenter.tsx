import { useState, useEffect } from "react";
import { HiPhone } from "react-icons/hi";
import NavBar from "./NavBar";

type CallStatus = "ringing" | "in-queue" | "answered" | "hung-up";

function CallCenter() {
  const [callStatus, setCallStatus] = useState<CallStatus>("ringing");
  const [progress, setProgress] = useState(0);

  const statusSteps: CallStatus[] = [
    "ringing",
    "in-queue",
    "answered",
    "hung-up",
  ];

  const statusLabels = {
    ringing: "Ringing",
    "in-queue": "In Queue",
    answered: "Answered",
    "hung-up": "Hung Up",
  };

  const statusColors = {
    ringing: "bg-yellow-500",
    "in-queue": "bg-blue-500",
    answered: "bg-green-500",
    "hung-up": "bg-gray-500",
  };

  useEffect(() => {
    const currentIndex = statusSteps.indexOf(callStatus);
    setProgress(((currentIndex + 1) / statusSteps.length) * 100);
  }, [callStatus]);

  const handleStartCall = () => {
    setCallStatus("ringing");

    setTimeout(() => setCallStatus("in-queue"), 2000);
    setTimeout(() => setCallStatus("answered"), 5000);
    setTimeout(() => setCallStatus("hung-up"), 10000);
  };

  const handleReset = () => {
    setCallStatus("ringing");
    setProgress(0);
  };

  const getCurrentStepIndex = () => statusSteps.indexOf(callStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activeMenu="call-center" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Call Center</h1>
          <p className="text-gray-600 mb-8">
            Monitor your call progress in real-time
          </p>

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
                          <span className="text-lg font-bold">{index + 1}</span>
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
                    {index < statusSteps.length - 1 && (
                      <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-300 -z-10" />
                    )}
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleStartCall}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
            >
              Start New Call
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Reset
            </button>
          </div>

          {/* Call Info */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Call Duration</p>
              <p className="text-xl font-semibold text-gray-800">
                {callStatus === "hung-up" ? "5:23" : "--:--"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Queue Position</p>
              <p className="text-xl font-semibold text-gray-800">
                {callStatus === "in-queue" ? "#3" : "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallCenter;
