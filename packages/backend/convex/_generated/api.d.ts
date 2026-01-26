/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as channels from "../channels.js";
import type * as comments from "../comments.js";
import type * as http from "../http.js";
import type * as likes from "../likes.js";
import type * as notes from "../notes.js";
import type * as openai from "../openai.js";
import type * as playlists from "../playlists.js";
import type * as settings from "../settings.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as videos from "../videos.js";
import type * as youtube from "../youtube.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  channels: typeof channels;
  comments: typeof comments;
  http: typeof http;
  likes: typeof likes;
  notes: typeof notes;
  openai: typeof openai;
  playlists: typeof playlists;
  settings: typeof settings;
  subscriptions: typeof subscriptions;
  users: typeof users;
  utils: typeof utils;
  videos: typeof videos;
  youtube: typeof youtube;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
