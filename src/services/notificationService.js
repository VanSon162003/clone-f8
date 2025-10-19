import httpRequest from "@/utils/httpRequest";

export const readNotification = async (data) => {
    const res = await httpRequest.post(`/notifications/read`, {
        data,
    });
    return res;
};

export default { readNotification };
