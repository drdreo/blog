import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterLink, RouterOutlet],
    template: `
        <section class="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <nav class="flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10">
                <a routerLink="/">Home</a>
            </nav>

            <main class="mb-auto">
                <router-outlet />
            </main>
        </section>
    `,
    styles: `
        :host {
            max-width: 1280px;
            margin: 0 auto;
        }

        nav {
            text-align: left;
            padding: 0 0 2rem 0;
        }
    `,
})
export class AppComponent {}
