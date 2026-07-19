import { BackgroundQueries, ContentQueries } from '../constants/internal.constants.ts';
import { Character, Score } from './data.type.ts';

export interface BackgroundGetCharacterQueryData {
  id: number;
}

export interface BackgroundGetCharacterQuery {
  data: BackgroundGetCharacterQueryData;
  name: 'FETCH_CHARACTER';
}

export type BackgroundGetCharacterResponse =
  | { character: Character; success: true }
  | { error: string; success: false };

export interface BackgroundCopyToClipboardQueryData {
  content: string;
}

export interface BackgroundCopyToClipboardQuery {
  data: BackgroundCopyToClipboardQueryData;
  name: 'COPY_TO_CLIPBOARD';
}

export interface BackgroundCopyToClipboardResponse {
  success: boolean;
}

export type BackgroundQuery = BackgroundGetCharacterQuery | BackgroundCopyToClipboardQuery;
export type BackgroundQueryName = (typeof BackgroundQueries)[keyof typeof BackgroundQueries];

export interface ContentExtractScoreDataQuery {
  data: Record<string, never>;
  name: 'EXTRACT_SCORE_DATA';
}

export type ContentExtractScoreDataResponse =
  | { score: Score; success: true }
  | { error: string; success: false };

export type ContentQuery = ContentExtractScoreDataQuery;
export type ContentQueryName = (typeof ContentQueries)[keyof typeof ContentQueries];

export interface IndexedDbBeatmapMetadata {
  id: number;
  artist: string;
  title: string;
  versions: Array<{ difficulty: number; id: number; total_length: number; version: string }>;
  backgroundBlob?: Blob | undefined;
}

export type SerializedScoreMap = [number, Score][];
export interface LocalStorageData {
  character?: Character;
  scores?: SerializedScoreMap;
}
