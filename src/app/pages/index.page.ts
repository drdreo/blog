import { injectContentFiles } from '@analogjs/content';
import { Component } from '@angular/core';
import { BlogListEntryComponent } from '../blog-list-entry/blog-list-entry.component';

import PostAttributes from '../post-attributes';
import { LogoComponent } from './index/logo/logo.component';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [BlogListEntryComponent, LogoComponent],
    template: `
        <blog-logo />

        <div class="space-y-2 pb-8 pt-6 md:space-y-5">
            <h1
                class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
            >
                Latest
            </h1>
            <p class="text-lg leading-7 text-gray-500 dark:text-gray-400">A blog created with Analog & Tailwind</p>
        </div>

        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (post of posts; track post.attributes.slug) {
                <blog-list-entry [post]="post"></blog-list-entry>
            }
        </ul>
    `,
})
export default class BlogComponent {
    readonly posts = injectContentFiles<PostAttributes>();
}
