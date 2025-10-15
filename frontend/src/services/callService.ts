import apiClient from "../config/apiClient";

interface CallPayload {
  from?: string;
  to?: string;
  callSid?: string;
  callStatus?: string;
}

export const createNewCall = async ({ from, to }: CallPayload) => {
  try {
    const res = await apiClient.post("/call-new", { from, to });
    return res.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to create new call:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const enqueueCall = async () => {
  try {
    const res = await apiClient.post("/call-enqueue");
    return res.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to enqueue call:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCallStatus = async ({
  callSid,
  callStatus,
}: CallPayload) => {
  try {
    const res = await apiClient.post("/call-status", {
      callSid,
      callStatus,
    });
    return res.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to update call status:",
      error.response?.data || error.message
    );
    throw error;
  }
};
