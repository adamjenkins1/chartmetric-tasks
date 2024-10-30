import { ResponseObject } from "./transform";

export const STRINGS_INPUTS: string[][] = [
  ["  nice", "hey there     ", "   woah       man "],
  ["hi"],
  [],
  ["hey", "    hey", "hey   "],
];

export const SAMPLE_API_RESPONSE: ResponseObject[] = [
  {
    id: 1293487,
    name: "KCRW", // radio station callsign
    tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }],
  },
  {
    id: 12923,
    name: "KQED",
    tracks: [
      { timestp: "2021-04-09", trackName: "Savage" },
      { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
    ],
  },
  {
    id: 4,
    name: "WNYC",
    tracks: [
      { timestp: "2021-04-09", trackName: "Captain Hook" },
      { timestp: "2021-04-08", trackName: "Captain Hook" },
      { timestp: "2021-04-07", trackName: "Captain Hook" },
    ],
  },
];

export const QUERIES = {
  QUERY_GET_ARTIST_INFO: {
    ARTIST_INSIGHTS: {
      GET_INSIGHTS_COUNT: (cm_artist: any, highWeight: any, mediumWeight: any, daysAgo: any) => `
      SELECT COUNT(*) as "count"
      FROM chartmetric.analytics.cm_artist_insights ai
      JOIN chartmetric.analytics.cm_artist_insights_weight aiw ON ai.target = aiw.target AND ai.type = aiw.type
      WHERE cm_artist = ${cm_artist}
      AND weight >= ${highWeight}
      AND timestp >= current_date - ${daysAgo}
      UNION
      SELECT COUNT(*) as "count"
      FROM chartmetric.analytics.cm_artist_insights ai
      JOIN chartmetric.analytics.cm_artist_insights_weight aiw ON ai.target = aiw.target AND ai.type = aiw.type
      WHERE cm_artist = ${cm_artist}
      AND weight >= ${mediumWeight}
      AND timestp >= current_date - ${daysAgo}
      `,
      GET_ARTIST_INSIGHTS: (cm_artist: any, limit: any, weight: any, daysAgo: any) => `
      WITH insights AS (
        SELECT ai.*, aiw.weight
        FROM chartmetric.analytics.cm_artist_insights ai
        JOIN chartmetric.analytics.cm_artist_insights_weight aiw ON ai.target = aiw.target AND ai.type = aiw.type
        WHERE cm_artist = ${cm_artist}
        AND weight >= ${weight}
        AND timestp >= current_date - ${daysAgo}
        ORDER BY timestp DESC, weight DESC
        LIMIT ${limit}
      )
      , artist AS (
        SELECT 
            DISTINCT i.cm_artist, 
            t.image_url AS artist_url
        from insights i
        JOIN raw_data.cm_artist t ON i.cm_artist = t.id
       )
      , track as (
        SELECT 
            DISTINCT i.cm_track, 
            t.image_url AS track_url
        FROM insights i
        JOIN raw_data.cm_track t ON i.cm_track = t.id
       )
      , album AS (
        SELECT 
            DISTINCT i.cm_album, 
            t.image_url AS album_url
        FROM insights i
        JOIN raw_data.cm_album t ON i.cm_album = t.id
       )
      SELECT i.* , 
          album.album_url, 
          track.track_url, 
          artist.artist_url
      FROM insights i
      LEFT JOIN album ON i.cm_album = album.cm_album
      LEFT JOIN track ON i.cm_track = track.cm_track
      LEFT JOIN artist ON i.cm_artist = artist.cm_artist
      `,
    },
  },
};
