import { MetaTag, RouteMeta } from "@analogjs/router";
import { Component } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { ResolveFn } from "@angular/router";

import PostAttributes from '../post-attributes';

// export const postMetaResolver: ResolveFn<MetaTag[]> = (route) => {
//   const postAttributes = injectActivePostAttributes(route);
//
//   return [
//     {
//       name: 'description',
//       content: postAttributes.description,
//     },
//     {
//       name: 'author',
//       content: 'Analog Team',
//     },
//     {
//       property: 'og:title',
//       content: postAttributes.title,
//     },
//     {
//       property: 'og:description',
//       content: postAttributes.description,
//     },
//     {
//       property: 'og:image',
//       content: postAttributes.coverImage,
//     },
//   ];
// };

@Component({
    selector: 'app-blog-post',
    imports: [AsyncPipe, MarkdownComponent, DatePipe],
    template: `
        @if (post$ | async; as post) {
            <article>
                <div class="flex justify-center flex-col items-center">
                    <h1 class="text-5xl">{{ post.attributes.title }}</h1>

                    <time
                        class="text-xs dark:text-slate-400 text-slate-600 pb-2"
                        [attr.datetime]="post.attributes.date | date: 'YYYY-MM-dd'"
                        >{{ post.attributes.date | date: 'dd.MM.YYYY' }}
                    </time>
                </div>
                @if (post.attributes.coverImage) {
                    <img class="post__image" [src]="post.attributes.coverImage" alt="blog cover image" />
                }

                <analog-markdown class="markdown-body" [content]="post.content" />
            </article>
        }
    `,
    styles: `
        .post__image {
            margin-bottom: 1rem;
            max-height: 40vh;
            justify-self: center;
        }
    `
})
export default class BlogPostComponent {
    readonly post$ = injectContent<PostAttributes>('slug');
}
