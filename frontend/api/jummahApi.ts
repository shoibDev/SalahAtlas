import apiClient from "@/api/apiClient";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import {JummahCreateRequest, JummahMapResponse} from "@/types/jummah";
import { JummahDetail} from "@/types/jummah";

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

export const getJummahDetail = async (jummahId: string): Promise<JummahDetail> => {
  try {
    const response = await apiClient.get(`${API_END_POINTS.GET_JUMMAH_DETAILS}/${jummahId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Jummah details:", error);
    throw error;
  }
};

/**
 * Join a Jummah event (add current user as attendee)
 * @param jummahId - The ID of the Jummah
 * @param accountId - The ID of the user account
 * @returns Promise with success status
 */
export const joinJummah = async (jummahId: string, accountId: string): Promise<boolean> => {
  try {
    const response = await apiClient.post(`/jummah/public/${jummahId}/attendee/${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error joining Jummah:", error);
    throw error;
  }
};

/**
 * Leave a Jummah event (remove current user from attendees)
 * @param jummahId - The ID of the Jummah
 * @param accountId - The ID of the user account
 * @returns Promise with success status
 */
export const leaveJummah = async (jummahId: string, accountId: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/jummah/public/${jummahId}/attendee/${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error leaving Jummah:", error);
    throw error;
  }
};

/**
 * Remove an attendee from a Jummah event (only for organizer)
 * @param jummahId - The ID of the Jummah
 * @param accountId - The ID of the attendee to remove
 * @returns Promise with success status
 */
export const removeAttendee = async (jummahId: string, accountId: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/jummah/public/${jummahId}/attendee/${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error removing attendee:", error);
    throw error;
  }
};

/**
 * Delete a Jummah event (only for organizer)
 * @param jummahId - The ID of the Jummah to delete
 * @returns Promise with success status
 */
export const deleteJummah = async (jummahId: string): Promise<void> => {
  try {
    await apiClient.delete(`/jummah/public/${jummahId}`);
  } catch (error) {
    console.error("Error deleting Jummah:", error);
    throw error;
  }
};
