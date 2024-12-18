import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
    selector: 'blog-nav',
    imports: [RouterLink],
    template: `
        <nav [class]="navClass()">
            <a
                routerLink="/"
                class="text-xl font-thin  text-gray-800 dark:text-gray-100 hover:text-amber-400 transition-colors"
            >
                Home
            </a>
        </nav>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    isOnBlogPage = toSignal(
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => {
                const root = this.route.root;
                const isRoot = root.children.length === 0 || root.firstChild?.snapshot.url.length === 0;
                return !isRoot;
            }),
        ),
    );

    navClass = computed(() => {
        const isOnBlogPage = this.isOnBlogPage();
        let classes = 'flex items-center w-full py-10 justify-between rounded-lg transition-all ';
        const blogClasses = 'sticky top-0 -mx-20';
        if (isOnBlogPage) {
            classes += blogClasses;
        }
        return classes;
    });

    constructor() {}
}
