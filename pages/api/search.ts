import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const fsqAPIToken = process.env.FSQ_API_TOKEN || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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

  console.log("ayyy", fsqAPIToken);

  const data = await results.json();
  res.status(200).json(data);
}
