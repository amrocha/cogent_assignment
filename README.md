# Restaurant Picker

This is a project to help Cogent Labs employees pick a restaurant to eat lunch at.

## Features

- Search the Foursquare API using keywords to find restaurants within 1km of the office
- See results both in list form, and on an interactive map
- Use the "I'm feeling lucky!" button (a la old school Google) to randomly select a restaurant
- Check out details about any given restaurants such as opening hours, pictures, etc. (note: Foursquare doesn't seem to be very popular in Japan so unfortunately it didn't have user reviews for most places)

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). As a relatively simple app, it made sense to use something with batteries built-in like Next. Next also makes it easy to deploy to a public URL if necessary via Vercel.

First you need to add a Foursquare API token. Create a `.env.local` file at the root of the directory:
```
FSQ_API_TOKEN=YOUR_TOKEN
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The server makes an API available that interfaces with the Foursquare API for the client.

## Pending Features

- Fix type issues with libraries, particularly with the Next server requests and Mapbox
- Add loading indicators
- Make the query parameters customizable (radius from office, opening hours, popularity, rating, etc)
- Logging
- Error surfacing (the app doesn't crash on most errors, but there's no indicator to the user that an error happened either)
- Testing. Add storybook and screenshot testing for the components, and unit tests for the utility functions.