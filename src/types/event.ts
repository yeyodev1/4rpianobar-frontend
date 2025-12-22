export interface Event {
  id: number | string;
  title: string;
  date: string; // ISO string or formatted date
  time: string;
  description: string;
  imageUrl: string;
  location?: string;
  price?: string;
  slug?: string; // Add slug for routing
}
