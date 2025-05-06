---
title: "Angular: httpResource In The Wild"
slug: http-resource-in-the-wild
description: How to use Angular's httpResource with real-world requirements
date: 2025-05-06
draft: false
tags:
    - Angular
    - http
    - API
coverImage: /demo-post_cover.jpg
---

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
user = httpResource(() => `/api/user/${currentUserId()}`);
```

Every time the user id changes, the user is re-requested.
Nice. Simple. Chapter closed. `httpClient.get` is now obsolete and we are happy.

But what if the API you have to deal with is stubborn and does not want to be straightforward?
Imagine, instead of a GET -- to _get_ data -- it's a POST endpoint. (Note: It's highly recommended to not use mutating requests with `httpResource`). Instead of returning a compatible data structure, you have to remap the DTO response. Or the backend request is just inefficient and very slow, therefore, client-side caching is required.

Luckily we can solve all of these struggles with the following solutions:
1. Configure the options to use the `POST` method
2. Parsing the response DTO structure into a new data structure via
   `parse?: (value: TRaw) => TResult;`
3. Using Cashew with `context` enables automagical caching.


## Client Setup

To demonstrate the API, let's assume a very simple case of fetching some entity  -- a client -- by ID.
The Data Transfer Object (DTO) and the client side type look like the following:
```ts
type ClientDTO = {
	firstname: string;
	lastname: string;
}

type ClientData = {  
    name: string;  
};
```


## Options

```ts
clientResource = httpResource<ClientData>(() => {  
    const clientId = this.clientId();  
    return {  
        url: this.apiUrl, // URL to your API
        method: 'POST',   // HTTP POST method
        body: {           // Request body (for POST)
            clientId
        }  
    };  
});
```

## Parsing The Response
When the API response structure differs from your client-side model, we have to re-map it. We can achieve this with the simple `parse` option.

> Transform the result of the HTTP request before it's delivered to the resource.
> > `parse` receives the value from the HTTP layer as its raw type (e.g. as `unknown` for JSON data). It can be used to validate or transform the type of the resource, and return a more specific type. This is also useful for validating backend responses using a runtime schema validation library such as Zod.

We can pass a parse function to the resource options, and its return value will be used as the resource value. We can achieve this like the following:
```ts
clientResource = httpResource<ClientData>(  
    () => {  
        const clientId = this.clientId();  
        return {  
            url: this.apiUrl,  
            method: 'POST',  
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
	name: z.string(),  
});

type ClientData = z.infer<typeof clientSchema>;

clientResource = httpResource<ClientData>(  
    () => {  
        const clientId = this.clientId();  
        return {  
            url: this.apiUrl,  
            method: 'POST',  
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
            method: 'POST',  
            body: {  
                clientId  
            }  
        };  
    },
    {  
        defaultValue: {  
            name: ''  
        }  
    }
);
```

This messed with me for quite some time since I did not understand why some UI elements keep flickering.

Why `undefined` is the default is really beyond me.

Rant: When we already have a value, it would make more sense to preserve it. Instead, Angular throws away the previous value, sets it to `undefined` during loading, then updates it with the new value after the request completes.

This re-triggers any dependencies or computed signal chains, which makes it annoying if `undefined` has to be handled in-between updates.

But to our rescue, they provide a `defaultValue` option, which is not really sufficient when you have to keep the previous value until the new one arrives.
You can probably work around this limitation with the `equal` option to filter out unintentional updates if the default value is present, but the overall behaviour still feels counterintuitive to me.

Anyways, `defaultValues` ... great! At least we can show something. Some data is better than no data, I suppose.

## Reactivity Can Suck

When your dependencies are asynchronous, you must consider that dependency values can be `undefined` . These cases need to be caught early and handled in the `httpResource` to prevent unintentional requests.

Multiple requests can be sent and cancelled in quick succession when you have several dependencies. For instance, when you await asynchronous data that feeds into multiple computed signals, each signal change triggers the `httpResource` to send a new request.
The default behaviour in this scenario is that any new API request will automatically cancel the ongoing one.

One thing to highlight is to NOT use `httpResource` for mutation operations (PUT, POST, DELETE).  
A subsequent update could cancel a previous request before it completes, potentially causing data loss.

## Summary
All these edge cases I have highlighted here should not deter one from using the new `httpResource` API. I prefer this way over the imperative `toSignal(http.get())` approach. The built-in handling for loading states and errors is very convenient.

Additionally, automatically syncing reactive data with an HTTP resource (good naming) feels really good. No more updating complex query objects and then manually calling service methods to re-trigger http calls.

I have used it so far in a semi-complex production Analytics application and was positively surprised by how well it integrates with an NgRx signal store.

# TL;DR

✔️ Use `httpResource()` for fetching data

❌ Avoid using it for mutations

⏸️ Early returning `undefined` prevents http requests to be sent

🟰 Use `equal` to prevent unintentional emits.

❔ Use `defaultValue` to prevent `undefined` values

💱 Use `parse` to parse API data structure.
