export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  clan: string;
  tribe: string;
  bio: string;
}

export enum Tribe {
  ZULU = 'Zulu',
  XHOSA = 'Xhosa',
  SOTHO = 'Sotho',
  TSWANA = 'Tswana',
  VENDA = 'Venda',
  NDEBELE = 'Ndebele'
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tribe: Tribe;
  clan: string;
  image?: string;
}

export interface ClanPraise {
  clanName: string;
  praises: string;
}

export interface ClanContact {
  id: string;
  name: string;
  role: string;
  clan: string;
  verified: boolean;
  avatar: string;
}

export interface KinRecommendation {
  id: string;
  name: string;
  clan: string;
  matchReason: string;
  avatar: string;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
}

