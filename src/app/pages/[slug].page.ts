import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import PostAttributes from '../post-attributes';
import { postMetaResolver, postTitleResolver } from '../resolvers';

export const routeMeta: RouteMeta = {
    title: postTitleResolver,
    meta: postMetaResolver
};

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
