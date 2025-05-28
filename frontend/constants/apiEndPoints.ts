export const BASE_API_URL = "http://192.168.0.35:8080";
export const WS_BASE_URL = "http://192.168.0.35:8080/ws";
export const API_END_POINTS = {
  // Auth endpoints
  LOGIN: `/auth/login`,
  SIGNUP: `/auth/signup`,
  REFRESH_TOKEN: `/auth/refresh`,

  // Jummah endpoints
  CREATE_JUMMAH: `/jummah/public`,
  GET_NEARBY_JUMMAHS: `/jummah/public/nearby`,
  GET_JUMMAH_DETAILS: `/jummah/public/detail`,

  // Chat endpoints
  GET_CHAT_HISTORY: `/chat/jummah/:jummahId/history/pageable`,

  // WebSocket topics
  WS_JUMMAH_TOPIC: `/topic/jummah/:jummahId`,
  WS_JUMMAH_SEND: `/app/jummah/:jummahId`,
};
