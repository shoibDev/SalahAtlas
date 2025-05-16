import apiClient from "@/api/apiClient";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import {JummahCreateRequest, JummahMapResponse} from "@/types/JummahTypes";

export const createJummah = async (jummah: JummahCreateRequest) => {
  try {
    const response = await apiClient.post(API_END_POINTS.CREATE_JUMMAH, jummah);
    return response.data;
  } catch (error) {
    console.error("Error creating Jummah:", error);
    throw error;
  }
};

export const getNearbyJummah = async (
    latitude: number,
    longitude: number
): Promise<JummahMapResponse[]> => {
  try {
    const response = await apiClient.get(API_END_POINTS.GET_NEARBY_JUMMAHS, {
      params: { latitude, longitude },
    });
    console.log("Nearby Jummah response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching nearby Jummah:', error);
    throw error;
  }
};