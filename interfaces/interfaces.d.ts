// src/types/db.ts

export interface Account {
  id: number;
  auth_user_id: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_active_user_id: number;
}

export interface SubscriptionType {
  id: number;
  type: string;
}

export interface StoreItem {
  id: number;
  name: string;
  description: string;
  upro_gold_cost: number;
  is_active: boolean;
  created_at: string; // ISO timestamp
}

export interface User {
  id: number;
  name: string;
  account_id: number;
  gender: string;
  age_group: number;
  weight: number | null;
  height: number | null;
  dominant_foot: boolean | null;
  playing_position: string | null;
  experience_total: number;
  subscription_type: number;
  upro_gold: number;
  profile_picture: string | null;
  equipped_avatar_id: number | null;
  equipped_profile_banner_id: number | null;
  created_at: string; // ISO timestamp
  status_preference: "online" | "dnd";
  last_active: string; // ISO timestamp
}

export type FriendshipStatus = "pending" | "accepted" | "rejected" | "blocked";

export interface Friendship {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: FriendshipStatus;
  created_at: string; // ISO timestamp
}

export interface Badge {
  id: number;
  xp_amount: number;
  name: string;
  description: string;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  created_at: string; // ISO timestamp
}

export type ClubMemberRole = "member" | "admin" | "owner";

export interface ClubMember {
  id: number;
  user_id: number;
  club_id: number;
  joined_at: string; // ISO timestamp
  role: ClubMemberRole;
}

export interface TrainingSession {
  id: number;
  title: string;
  description: string;
  experience_reward: number;
  duration_minutes: number | null;
  created_at: string; // ISO timestamp
}

export interface TrainingResult {
  id: number;
  user_id: number;
  training_session_id: number;
  xp_amount: number;
  created_at: string; // ISO timestamp
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string; // ISO timestamp
}

export interface StorePurchase {
  id: number;
  user_id: number;
  store_item_id: number;
  quantity: number;
  total_cost: number;
  purchased_at: string; // ISO timestamp
}
