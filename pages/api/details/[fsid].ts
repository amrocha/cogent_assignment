import type { NextApiRequest, NextApiResponse } from "next";

const fsqAPIToken = process.env.FSQ_API_TOKEN || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fsid } = req.query;
  // TODO: type safety
  // @ts-ignore-next-line
  const searchParams = new URLSearchParams(req.query).toString();

  const results = await fetch(
    `https://api.foursquare.com/v3/places/${fsid}?${searchParams}`,
    {
      method: "get",
      headers: new Headers({
        Accept: "application/json",
        Authorization: fsqAPIToken,
      }),
    }
  );

  const data = await results.json();
  res.status(200).json(data);
}
