import type { NextApiRequest, NextApiResponse } from "next";

const fsqAPIToken = process.env.FSQ_API_TOKEN || "";

let CATEGORIES = ["ramen", "chinese", "western", "italian", "sushi", "indian"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.query) {
    console.log("heyoooo");
    let category = Math.floor(Math.random() * CATEGORIES.length);
    req.query.query = CATEGORIES[category];
  }
  // TODO: type safety
  // @ts-ignore-next-line
  const searchParams = new URLSearchParams(req.query).toString();

  const results = await fetch(
    `https://api.foursquare.com/v3/places/search?${searchParams}`,
    {
      method: "get",
      headers: new Headers({
        Accept: "application/json",
        Authorization: fsqAPIToken,
      }),
    }
  );

  const data = await results.json();
  let lucky = Math.floor(Math.random() * data.results.length);
  data.results = [data.results[lucky]];
  res.status(200).json(data);
}
