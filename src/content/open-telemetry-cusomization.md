---
title: "OpenTelemetry: a customizable standard"
slug: opentelemetry-custom-2024
description: Customizing the OT
date: 2024-12-27
draft: false
tags:
  - OpenTelemetry
  - JavaScript
  - markdown
  - blog
  - post
coverImage: /demo-post_cover.jpg
---

Have you ever had the pleasure to SSH into 15 different servers to extract the log files? - No? Good.
Did you ever fail to copy and paste an error message or stack trace from said servers to google it? - No? Gut.
Have you ever tried to find out which entity called your server? - No? Gud.

If you can answer these questions with *No*, you are either in the pleasure of an observability tool already or have no care for such things.
If you answered these with yes -- I feel with you, and I hope you no longer have to.

In the world of modern, distributed systems, traditional debugging sucks or is even impossible to get the job done. Applications are no longer simple, linear processes but a complex web of services, microservices, frontends calling backends and backends calling frontends.

There are a ton of valid reasons why one needs observability, but likely as many to standardize it.

Many Software observability tools popped up over the years. All with their own take and twist to the three pillars of observability:
- Tracing,
- Logging and.
- Metrics

NewRelic, DataDog, Sentry, ApplicationInsights, Dynatrace just to name a few.

In the following few minutes, I will shortly explain what OpenTelemetry (OT) tries to solve and what these three pillars -- Tracing, Logging and Metrics -- entail.
Although, I want to highlight that way better articles exist that go more into the What and Why of OT, rather than the How.
Therefore, my focus here is on customizability and i will demonstrate how one can utilize the standard to create your own rules over data ingestion and lastly will provide a hidden joke. Keep reading.

## What is this open telekinesis?
Excerpt from from [their docs](https://opentelemetry.io/):

>OpenTelemetry is a collection of APIs, SDKs, and tools. Use it to instrument, generate, collect, and export telemetry data (metrics, logs, and traces) to help you analyze your software’s performance and behavior.

> OpenTelemetry is [generally available](https://opentelemetry.io/status/) across [several languages](https://opentelemetry.io/docs/languages/) and is suitable for production use.

It somewhat struck me that they have to explicitly mention that they are are *suitable for production* -- Which software isn't, right?!

Long story short; OpenTelemetry is an open, community-driven standard that unifies all central pieces to observability. It emerged by merging two standards (reference to the xkcd meme) [OpenTracing](https://opentracing.io/) and [OpenCensus](https://opencensus.io/) into one.
![ot_custom_xkcd_standards](/images/ot_custom_xkqc_standards.png)


### The Three Pillars of Observability

OpenTelemetry focuses on three key types of telemetry data:

1. **Tracing**: Tracks the journey of a request through different services
2. **Logging**: Captures discrete events and messages
3. **Metrics**: Measures system performance and key indicators


## First custom, then standard, then custom again?!

Yes, but it was just bait after all. Lets take a step back first.

Initially I mentioned accessing server log files manually. While for some this sounds just like a horror story from the 80s, for some it still is reality. We feel with you. Introducing a fancy logging product that all your servers log to sounds amazing for this case - if regulations allow for that. Not everyone has the freedom to recklessly send data around the globe. Who really knows where these monitoring providers put there data. Once it gets as far as setting up contracts with data


Depending on all the fancy monitoring vendors out there to get you the insights you need might not be the best idea after all.

Picture this; You are working at a company with Sentry for frontend application logging, Azure Application Insights for backend apps, Grafana for dashboarding, a few dashboards in Tableau and sprinkle some DataDog in there for on-call alerts and you have a hell of a setup.

Imagine you could throw this all out and just unify it across the company. All of the major tool vendors support the full stack in one way or another after all. You chose one and migrated all of your applications. After a while you figured out that your locked into that one vendor but are missing feature X from Application Insights and feature Y & Z are not as intuitive as they were in Sentry. Dashboards are too basic and you wished Grafana still was a thing.

Note: This example is not particularly target at one vendor by the way. It could be any provider really.

Granted, these tools will eventually catch up with requests and unify the data that software developers can ingest and access. Nevertheless, we can already now stop relying on their advances in telemetry and increase the adoption of a uniform and open standard.

I had asked some people over at NewRelic what they believed the main business will be once an open standard removes the need to create and maintain custom agents.
Short answer was that then the vendor will be chosen by who provides the nicest visualization on top of said standard. Once ingestion is no longer witchcraft, focus can be put elsewhere.

### OpenTelemetry Protocol - OTLP
https://opentelemetry.io/docs/specs/otlp/
First we need a standard protocol - OTLP. Implementing it allows our application to export data to different backends or collectors. Luckily, that protocol is implemented by OpenTelemetry and they offer us neat SDKs for all modern languages.
We just have to go as deep into the standard as to be able to use the provided APIs or community plugins.

## Custom Logging
Anything that can be logged as a string goes here.
![ot_custom_log_meme](/images/ot_custom_log_meme.png)

```js
const { logs } = require('@opentelemetry/api-logs');
const logger = logs.getLogger('application-logger');

function handleCriticalEvent(eventType, details) {
  logger.emit({
    severityNumber: 13,  // Critical level
    severityText: 'CRITICAL',
    body: `Critical event occurred: ${eventType}`,
    attributes: {
      'event.type': eventType,
      'event.details': JSON.stringify(details)
    }
  });
}
```

## Custom Tracing
Tracing helps you understand the path and performance of requests across your system:
```js
const opentelemetry = require('@opentelemetry/api');
const tracer = opentelemetry.trace.getTracer('my-service');

async function processUserOrder(userId, orderDetails) {
  // Create a root span for the entire operation
  const span = tracer.startSpan('process-order');
  
  try {
    span.setAttribute('user.id', userId);
    span.setAttribute('order.size', orderDetails.items.length);
    
    // Simulate sub-operations
    await validateOrder(orderDetails);
    await processPayment(orderDetails);
    
    span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ 
      code: opentelemetry.SpanStatusCode.ERROR, 
      message: error.message 
    });
  } finally {
    span.end();
  }
}
```


## Custom Metrics
Metrics help you track system performance and key business indicators:

```js
const opentelemetry = require('@opentelemetry/api');
const meter = opentelemetry.metrics.getMeter('performance-meter');

// Track API request duration
const requestDuration = meter.createHistogram('api_request_duration', {
  description: 'Tracks the duration of API requests'
});

function measureApiRequestTime(duration, endpoint) {
  requestDuration.record(duration, {
    'api.endpoint': endpoint
  });
}
```


## Conclusion

OpenTelemetry transforms complex system monitoring from a nightmare into a manageable... ah ChatGPT stop being so bad at writing with a story.
Lets conclude that OpenTelemetry is awesome. Once all observability vendors support it to the fullest, we can all benefit from a unified way to stare at data.
Even though it might not be a fast undertaking, as more complicated features, like Session Replays in the frontend, are hard to agree on and standardize.

Having these APIs -- for Tracing, Logging and Metrics -- available allows developers to record any data themselves, removing the need to wait for tool vendors to implement a feature.

Embrace observability, and never log errors again! 🔍
