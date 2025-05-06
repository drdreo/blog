---
title: "Angular: httpResource In The Wild"
slug: http-resource-in-the-wild
description: How to use Angular's httpResource with real-world requirements. Sending POST requests, parsing the response, and caching.
date: 2025-05-06
draft: false
tags:
    - Angular
    - http
    - API
coverImage: /images/ng_http_resource_cover.jpg
---

# TL;DR

✔️ Use `httpResource()` for fetching data

❌ Avoid using it for mutations

⏸️ Early returning `undefined` prevents http requests to be sent

🟰 Use `equal` to prevent unintentional emits.

❔ Use `defaultValue` to prevent `undefined` values

💱 Use `parse` to parse API data structure.

## Introduction

Angular docs: https://angular.dev/api/common/http/httpResource

If this is the first time hearing about `httpResource`, I recommend checking out the official Angular article https://blog.angular.dev/seamless-data-fetching-with-httpresource-71ba7c4169b9.
They will introduce you to the new API and showcase the configuration.

The goal of this post is to showcase the real-world scenario where APIs are not perfect and unexpected requirements come out of the blue.

**TL;DR** It replaces using the http client directly to **get** and automatically re-request data.

> Create a [Resource](https://angular.dev/api/core/Resource) that fetches data with an HTTP GET request to the given URL.
>
> If a reactive function is passed for the URL, the resource will update when the URL changes via signals.

The simplest way to use an http resource is like the following:

```ts
import { httpResource } from '@angular/common/http';

user = httpResource(() => `/api/user/${currentUserId()}`);
```

Every time the user id changes, the user is re-requested.
Nice. Simple. Chapter closed. `http.get` is now obsolete and we are happy.

But what if the API you have to deal with is stubborn and does not want to be straightforward?

Imagine, instead of a GET -- to _get_ data -- it's a POST endpoint. (Note: It's highly recommended to not use mutating requests with `httpResource`). Instead of returning a compatible data structure, you have to remap the DTO response. Or the backend request is just inefficient and very slow, therefore, client-side caching is required.

Luckily we can solve all of these struggles with the following solutions:

1. Configure the options to use the `POST` method
2. Parsing the response DTO structure into a new data structure via `parse`
3. Using Cashew with `context` enables automagical caching.

## Client Setup

To demonstrate the API, let's assume a very simple case of fetching some entity -- a client -- by ID.
The Data Transfer Object (DTO) and the client side type look like the following:

```ts
type ClientDTO = {
    firstname: string;
    lastname: string;
};

type ClientData = {
    name: string;
};
```

The endpoint we are calling is a POST request to `/api/client` with the following body:

```json
{
    "clientId": 123
}
```

Then we could setup the `httpResource` like this:

```ts
clientResource = httpResource<ClientData>(() => {
    const clientId = this.clientId();
    return {
        url: this.apiUrl, // URL to your API
        method: "POST", // HTTP POST method
        body: {
            // Request body (for POST)
            clientId
        }
    };
});
```

## Parsing The Response

When the API response structure differs from your client-side model, we have to re-map it. We can achieve this with the `parse` option.

> Transform the result of the HTTP request before it's delivered to the resource.
>
> > `parse` receives the value from the HTTP layer as its raw type (e.g. as `unknown` for JSON data). It can be used to validate or transform the type of the resource, and return a more specific type. This is also useful for validating backend responses using a runtime schema validation library such as Zod.

We can pass a parsing function to the resource options, and its return value will be used as the resource value. This will look something like the following:

```ts
clientResource = httpResource<ClientData>(
    () => {
        const clientId = this.clientId();
        return {
            url: this.apiUrl,
            method: "POST",
            body: {
                clientId
            }
        };
    },
    {
        parse: (dto: unknown): ClientData => {
            const { firstname, lastname } = dto as ClientDTO;
            return {
                name: `${firstname} ${lastname}` // arbitrary data mapping
            };
        }
    }
);
```

We have to resort to `unknown` and type casting for the DTO since the `TRaw` argument is not yet properly typeable on the options `parse?: (value: TRaw) => TResult;`.

I hope that the resource generics will allow typing HTTP response and resource value like the following in the future: `httpResource<ClientDTO, ClientData>()` , but for now, `unknown` it is.

### Zod Parsing

For those who prefer using validation libraries, Zod can be directly used as a parser.

```ts
const clientSchema = z.object({
    name: z.string()
});

type ClientData = z.infer<typeof clientSchema>;

clientResource = httpResource<ClientData>(
    () => {
        const clientId = this.clientId();
        return {
            url: this.apiUrl,
            method: "POST",
            body: {
                clientId
            }
        };
    },
    { parse: clientSchema.parse }
);
```

## Caching

Cashew https://github.com/ngneat/cashew

> Caching is nut a problem!

With that neat angular caching library, we can achieve caching of the response as easy as this:

```ts
import { withCache } from "@ngneat/cashew";

clientResource = httpResource<ClientData>(() => {
    const clientId = this.clientId();
    return {
        url: this.apiUrl, // URL to your API
        method: "POST", // HTTP POST method
        body: {
            // Request body (for POST)
            clientId
        },
        context: withCache() // this enables in-memory caching
    };
});
```

Make sure to customize the cache key to your needs if you have a request body. Otherwise, it will default to the request URL including any query parameters.

## Default Values

Using `defaultValue` comes in handy when you expect the data to not become `undefined` and always adhere to a certain type. Because by default, `httpResource` resets its value to `undefined`.

> Value that the resource will take when in Idle, Loading, or Error states.
> If not set, the resource will use `undefined` as its default value.

```ts
clientResource = httpResource<ClientData>(
    () => {
        const clientId = this.clientId();
        return {
            url: this.apiUrl,
            method: "POST",
            body: {
                clientId
            }
        };
    },
    {
        defaultValue: {
            name: ""
        }
    }
);
```

This messed with me for quite some time -- I couldn't figure out why some UI elements kept flickering.

Why `undefined` is the default is really beyond me.

**Rant:** When we already have a value, it would make more sense to preserve it. Instead, Angular throws away the previous value, sets it to `undefined` during loading, then updates it with the new value after the request completes.

This re-triggers any dependencies or computed signal chains, which makes it annoying if `undefined` has to be handled in-between updates.

But to our rescue, they provide a `defaultValue` option, which is not really sufficient when you have to keep the previous value until the new one arrives.
You can probably work around this limitation with the `equal` option to filter out unintentional updates if the default value is present, but the overall behaviour still feels counterintuitive to me.

Anyways, `defaultValues` ... great! At least we can show something. Some data is better than no data, I suppose.

###  Final Note
To me these stupid simple code examples don't really cut it to show how one could use a new technology. 
So here's a more complex construct using only signals and the `httpResource` API. One might see now why i was so eager to demonstrate the POST method (please don't use GraphQL with httpResources 😅):
```ts
timeSeriesResource = httpResource<Timeseries>(() => {
        const filters = this.filterStore.filters();
        const period = this.filterStore.period();
        const granularity = this.filterStore.granularity();
        const currentEntityType = this.filterStore.currentEntityType();
        const currentEntityId = this.filterStore.currentEntityId();
        const x = this.xStore.getCurrentX();
        const entityFilter = getEntityFilter(currentEntityType, currentEntityId);
        const body = {
            d: [...],
            m: [...],
            filters: [
                {
                    X: [x.Id]
                },
                ...mapFiltersToDto(filters),
                ...(entityFilter ? [entityFilter] : [])
            ],
            interval: mapPeriodToDto(period),
            granularity: mapGranularityToDto(granularity),
            pivotDimension: { ... },
            type: "timeseries",
            timezone: "UTC",
            descendingOrder: true,
            limit: "420"
        };
        return {
            url: this.apiUrl,
            method: "POST",
            body,
            context: withCache({
                key: "timeseries-" + JSON.stringify(body)
            })
        };
    },
    {
        defaultValue: [],
        parse: mapDtoToTimeseries
    }
);
```

## Reactivity Can Suck

When your dependencies are asynchronous, you _should_ account for the case when they are still `undefined`. These edge cases need to be handled early in the `httpResource` to prevent unintentional requests.

Multiple requests can be triggered and cancelled in quick succession if you have several dependencies. For example, when you await asynchronous data that feeds into multiple computed signals, each signal change may re-trigger the `httpResource` and send a new request.
The default behaviour in this scenario is that any new API request will automatically cancel the ongoing one.

One important point to highlight: **don't use `httpResource` for mutation operations** (PUT, POST, DELETE).  
A subsequent update could cancel a previous request before it completes, potentially causing data loss.

## Summary

All these edge cases shouldn't stop you from trying the new httpResource API. I prefer this way now over the imperative `toSignal(http.get())` approach. The built-in loading and error handling is _very_ convenient.

Plus, automatically syncing reactive data with an HTTP resource (great naming btw) just feels right. No more updating complex query objects and manually calling service methods to re-trigger http calls.

I have used it so far in a semi-complex production Analytics application and was positively surprised by how well it integrates with an NgRx signal store and how it made my life way easier and more predictable.
