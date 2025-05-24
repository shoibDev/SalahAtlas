import {PublicUser} from "@/types/user";

export interface JummahCreateRequest {
  date: string;           // in 'YYYY-MM-DD' format
  time: string;           // in 'HH:mm:ss' format
  latitude: number;
  longitude: number;
  notes: string;
  prayerTime: 'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA'; // match your Java enum
}

export interface JummahMapResponse {
  id: string;
  latitude: number;
  longitude: number;
  isVerifiedOrganizer: boolean;
}

export interface JummahDetail {
  id: string;
  date: string;
  time: string;
  prayerTime: string;
  notes: string;
  organizer: PublicUser;
  attendees: PublicUser[];
}