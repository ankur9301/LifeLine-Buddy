export interface Emergency {
  id: string;
  type: string;
  location: string;
  time: string;
  severity: "CRITICAL" | "URGENT" | "STANDARD";
  summary?: string;
  transcript: {
    role: "agent" | "user";
    message: string;
  }[];
  emotions?: {
    fear: number;
    confusion: number;
    [key: string]: number;
  };
  coordinates?: [number, number]; // [longitude, latitude]
  phone_number?: string | null;
  encoded_audio?: string;
  imageUrl?: string | null;
  status: "open" | "closed";
}
