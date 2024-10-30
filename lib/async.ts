import { QUERIES } from "./constants";

function snowflakeClientExecuteQuery(query: string) {
  return Promise.resolve([]);
}

function filterResults(objs: any[]): any[] {
  return objs;
}

function insightToNews(obj: any): Promise<any> {
  return Promise.resolve(obj);
}

function formatInsight(obj: any): Promise<any> {
  return Promise.resolve(obj);
}

export async function getArtistInsights(query: any) {
  let { id, limit, weight, daysAgo, newsFormat } = query;
  if (weight === undefined) {
    const counts = await snowflakeClientExecuteQuery(
      QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
        id,
        8, // high weight
        4, // medium weight
        daysAgo,
      ),
    );
    const high = counts[0]?.count;
    const medium = counts[1]?.count;
    if (high) {
      weight = 8; // high weight
    } else if (medium) {
      weight = 4; // medium weight
    } else {
      weight = 1; // low weight
    }
  }

  const insights = await snowflakeClientExecuteQuery(
    QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(id, limit * 10, weight, daysAgo),
  );

  let results = [];
  for (const insight of insights) {
    const filteredResults = filterResults(insight);
    let formattedInsights = [];
    for (const result of filteredResults) {
      let formattedInsight = await formatInsight(result);
      if (formattedInsight) {
        formattedInsight = result.slice(0, limit + (10 - weight) * 200);
        formattedInsights.push(formattedInsight);
      }
    }

    if (!newsFormat) {
      results.push(formattedInsights);
      continue;
    }

    let newsInsights = [];
    for (const insight in formattedInsights) {
      newsInsights.push(await insightToNews(insight));
    }

    results.push({ insights: newsInsights, weight: weight });
  }

  return results;
}
