import axios, { AxiosResponse } from "axios";
import {
  AwardChoice,
  SpotifySearchAlbumResult,
  SpotifySearchArtistResult,
  SpotifySearchTrackResult,
  User,
  YoutubeSearchResult,
} from "../../types";

const baseURL = "/api";

const axi = axios.create({
  baseURL,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

const api = {
  auth: {
    user(): Promise<AxiosResponse<User>> {
      return axi.get("/auth/user");
    },
    logout(): Promise<AxiosResponse> {
      return axi.get("/auth/logout");
    },
  },
  survey: {
    listCategories(): Promise<AxiosResponse> {
      return axi.get("/categories");
    },
    listChoices(): Promise<AxiosResponse> {
      return axi.get("/choices");
    },
    submit(data: Record<string, AwardChoice | null>): Promise<AxiosResponse> {
      return axi.post("/answer", data);
    },
    retrieve(id: string): Promise<AxiosResponse<Record<string, AwardChoice | null>>> {
      return axi.get(`/answer/${id}`);
    },
  },
  search: {
    spotify(
      type: "album" | "artist" | "track",
      query: string,
    ): Promise<AxiosResponse<SpotifySearchAlbumResult | SpotifySearchTrackResult | SpotifySearchArtistResult>> {
      const q = encodeURIComponent(`${query} year:2022`);
      return axi.get(`/spotify/search?type=${type}&q=${q}&limit=20&market=KR`);
    },
    youtube(query: string): Promise<AxiosResponse<YoutubeSearchResult>> {
      return axi.get(`/youtube/search?q=${query}`);
    },
  },
};

export default api;
