export type Track = {
  timestp: string;
  trackName: string;
};

export type ResponseObject = {
  id: number;
  name: string;
  tracks: Track[];
};

export type Transformed = {
  x: string;
  y: number;
  tooltip?: string;
};

export function transform(response: ResponseObject[]): Transformed[] {
  // flatten tracks from response object
  const tracks: Track[] = response.map((obj) => obj.tracks).flat();
  // group tracks by date
  const tracksByDate: Track[][] = Object.values(
    tracks.reduce((acc: any, curr: Track) => {
      if (!acc[curr.timestp]) {
        acc[curr.timestp] = [];
      }

      acc[curr.timestp].push(curr);
      return acc;
    }, {}),
  );

  // for every track group, format it into a Transformed instance
  return tracksByDate.map((t) => {
    // reduce to count total number of tracks and instances of individual tracks
    const partial = t.reduce(
      (acc: any, curr: Track) => {
        acc.x = curr.timestp;
        acc.y++;
        if (!acc.counts[curr.trackName]) {
          acc.counts[curr.trackName] = 0;
        }

        acc.counts[curr.trackName]++;
        return acc;
      },
      { x: "", y: 0, counts: {} },
    );

    // use individual track counts to format tooltip
    const tooltip = Object.keys(partial.counts)
      .map((key) => `${key} (${partial.counts[key]})`)
      .join(", ");

    // return final Transformed instance
    return {
      x: partial.x,
      y: partial.y,
      tooltip: tooltip,
    };
  });
}
