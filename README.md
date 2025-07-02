# Exchange Rate API

## Overview

The exchange rate API has two endpoints: `/exchange` and `/`.

The root endpoint is used to check the health of the service. This returns a simple JSON object as follows:

```json
{
  "healthy": true
}
```

The `/exchange` endpoint is used to retrieve the exchange rate between two currencies. This endpoint takes two query parameters: `baseCode` and `exchangeCode`. The `baseCode` is the currency you want to view the exchange rate for, e.g. `GBP`. The `exchangeCode` is the currency you want to view the exchange rate against, e.g. `USD`. This endpoint returns a JSON object as follows:

```json
{
  "exchangeRate": {
    "baseCode": "GBP",
    "exchangeCode": "USD",
    "rate": 0.81
  }
}
```

If there is some kind of error with the request, be it a malformed request or an error from the external API, the endpoint will return a JSON object with a `message` property as follows:

```json
{
  "message": "Exchange rate not found"
}
```

This may also return validation issues related to the request parameters, e.g. if the `baseCode` is missing:

```json
{
  "message": "Invalid query params",
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "baseCode"
      ],
      "message": "Required",
      "origin": "value"
    }
  ]
}
```

More detailed docs can be found at `/api-docs`.

## What I would do differently given more time

- I would improve the error handling, and use an actual error handling middleware rather than just logging the errors and manually handling them across the codebase. This could be done using an error type for each HTTP status code, and a middleware that uses the error type to handle the response.
- I would add more tests to cover the error handling and edge cases. Also, at present, there's only really either unit tests or end to end tests that hit the actual API, which can be flakey. It would be better to implement some integration tests that verify how different parts of the codebase interact with each other without depending on an external API.
- I considered implementing caching, as the data in the API does not change frequently and could help performance and avoid rate limits. I ultimately decided against it, as it would be tricky to do to a reasonable standard within the expected timeframe of the task. The caching could potentially be implemented using Redis, or an in-memory cache if we wanted to keep things simple (and if the API were being hosted on a single machine).
