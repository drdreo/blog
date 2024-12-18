import { ContentFile } from '@analogjs/content';
import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../post-attributes';

@Component({
    selector: 'blog-list-entry',
    imports: [RouterLink, DatePipe],
    templateUrl: './blog-list-entry.component.html',
    styleUrl: './blog-list-entry.component.scss'
})
export class BlogListEntryComponent {
    _post = input.required<ContentFile<PostAttributes>>({ alias: 'post' });
}
