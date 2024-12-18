import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import PostAttributes from '../post-attributes';
import { postMetaResolver, postTitleResolver } from '../resolvers';

export const routeMeta: RouteMeta = {
    title: postTitleResolver,
    meta: postMetaResolver
};

@Component({
    selector: 'app-blog-post',
    imports: [MarkdownComponent, DatePipe],
    template: `
        @let post = _post();
        @if (post) {
            <article>
                <div class="flex justify-center flex-col items-center">
                    <h1 class="text-5xl">{{ post.attributes.title }}</h1>

                    <div class="pb-2 text-xs dark:text-slate-400 text-slate-600">
                        <time [attr.datetime]="post.attributes.date | date: 'YYYY-MM-dd'"
                            >{{ post.attributes.date | date: 'dd.MM.YYYY' }}
                        </time>
                         -
                        <time>{{ readTime() }}</time>
                    </div>
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
    readonly _post = toSignal(injectContent<PostAttributes>('slug'));

    readTime = computed(() => {
        const post = this._post();
        if (!post?.content) {
            return undefined;
        }
        const text = post.content as string;
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        return time + 'min';
    });
}
