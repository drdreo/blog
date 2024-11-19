import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';

import PostAttributes from '../post-attributes';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="space-y-2 pb-8 pt-6 md:space-y-5">
            <h1
                class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
            >
                Latest
            </h1>
            <p class="text-lg leading-7 text-gray-500 dark:text-gray-400">
                A blog created with Next.js and Tailwind.css
            </p>
        </div>

        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (post of posts; track post.attributes.slug) {
                <li class="py-12">
                    <article>
                        <div class="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                            <dl>
                                <dt class="sr-only">Published on</dt>
                                <dd class="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                                    <time datetime="2023-08-05T00:00:00.000Z">August 5, 2023</time>
                                </dd>
                            </dl>
                            <div class="space-y-5 xl:col-span-3">
                                <div class="space-y-6">
                                    <div>
                                        <h2 class="text-2xl font-bold leading-8 tracking-tight">
                                            <a
                                                class="text-gray-900 dark:text-gray-100"
                                                [routerLink]="['/', post.attributes.slug]"
                                            >{{ post.attributes.title }}</a
                                            >
                                        </h2>
                                        <div class="flex flex-wrap">
                                            <a
                                                class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                            >next-js</a
                                            ><a
                                            class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        >tailwind</a
                                        ><a
                                            class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        >guide</a
                                        ><a
                                            class="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        >feature</a
                                        >
                                        </div>
                                    </div>
                                    <div class="prose max-w-none text-gray-500 dark:text-gray-400">
                                        {{ post.attributes.description }}
                                    </div>
                                </div>
                                <div class="text-base font-medium leading-6">
                                    <a
                                        class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        aria-label='Read more: "Release of Tailwind Nextjs Starter Blog v2.0"'
                                        [routerLink]="['/', post.attributes.slug]"
                                    >Read more →</a
                                    >
                                </div>
                            </div>
                        </div>
                    </article>
                </li>
            }
        </ul>
    `,
})
export default class BlogComponent {
    readonly posts = injectContentFiles<PostAttributes>();
}
