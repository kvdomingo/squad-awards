import { AlertColor } from "@mui/material";
import exp from "constants";

export interface StepInterface {
  key: string;
  label: string;
  type: "artist" | "track" | "album" | "video" | "custom" | null;
}

export interface AwardChoice {
  id: string;
  category: string;
  name: string;
  image: string | null;
}

export interface AwardCategory {
  label: string;
  key: string;
}

export interface SpotifyArtistItem {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export interface SpotifyTrackItem {
  album: Partial<SpotifyAlbumItem>;
  artists: SpotifyArtistItem[];
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface SpotifyAlbumItem {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: "album";
  artists: SpotifyArtistItem[];
  tracks: SpotifyTrackItem[];
}

interface SpotifySearchBaseResult<T> {
  href: string;
  items: T;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface SpotifySearchArtistResult {
  artists: SpotifySearchBaseResult<SpotifyArtistItem[]>;
}

export interface SpotifySearchAlbumResult {
  albums: SpotifySearchBaseResult<SpotifyAlbumItem[]>;
}

export interface SpotifySearchTrackResult {
  tracks: SpotifySearchBaseResult<SpotifyTrackItem[]>;
}

export interface YoutubeSearchResult {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
  }[];
}

export interface GlobalNotificationState {
  visible: boolean;
  message: string;
  severity: AlertColor;
}

export interface User {
  id: string;
  created: string;
  discord_id: string;
  avatar: string;
  username: string;
  discriminator: string;
  has_answered: boolean;
}
