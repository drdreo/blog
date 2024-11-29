import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { injectContent, MarkdownComponent } from '@analogjs/content';

import PostAttributes from '../post-attributes';

@Component({
    selector: 'app-blog-post',
    standalone: true,
    imports: [AsyncPipe, MarkdownComponent],
    template: `
        @if (post$ | async; as post) {
            <article>
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
        }
    `,
})
export default class BlogPostComponent {
    readonly post$ = injectContent<PostAttributes>('slug');
}
