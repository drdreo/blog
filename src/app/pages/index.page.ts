import { injectContentFiles } from '@analogjs/content';
import { Component } from '@angular/core';
import { BlogListEntryComponent } from '../blog-list-entry/blog-list-entry.component';

import PostAttributes from '../post-attributes';
import { LogoComponent } from './index/logo/logo.component';

@Component({
    selector: 'app-blog',
    imports: [BlogListEntryComponent, LogoComponent],
    template: `
        <blog-logo id="top" />

        <div class="space-y-2 pb-8 pt-6 md:space-y-5">
            <h1
                class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
            >
                Blog
            </h1>
            <p class="text-lg leading-7 text-gray-500 dark:text-gray-400">Created with Analog & Tailwind</p>
        </div>

        <ul class="divide-y divide-gray-200 dark:divide-gray-700 list-none">
            @for (post of posts; track post.attributes.slug) {
                <blog-list-entry [post]="post"></blog-list-entry>
            }
        </ul>
    `
})
export default class BlogComponent {
    readonly posts = injectContentFiles<PostAttributes>(
        (post) => !post.attributes.draft || import.meta.env.DEV
    );
}
