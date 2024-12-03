import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'blog-nav',
    standalone: true,
    imports: [RouterLink],
    template: `
        <nav
            [class.-mx-20]="isOnBlogPage()"
            class="flex items-center w-full sticky py-10 top-10 justify-between rounded-lg transition-all"
        >
            <a
                routerLink="/"
                class="text-xl font-thin  text-gray-800 dark:text-gray-100 hover:text-amber-400 transition-colors"
            >
                Home
            </a>
        </nav>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    isOnBlogPage = signal(false);

    constructor() {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            console.log(event);
            const root = this.route.root;
            const isRoot = root.children.length === 0 || root.firstChild?.snapshot.url.length === 0;
            this.isOnBlogPage.set(!isRoot);
        });
    }
}
