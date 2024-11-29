import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterLink, RouterOutlet],
    template: `
        <section class="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 relative">
            <nav
                class="flex items-center w-full sticky py-10 top-10 justify-between rounded-lg transition-colors -mx-20"
            >
                <a
                    routerLink="/"
                    class="text-xl font-thin  text-gray-800 dark:text-gray-100 hover:text-amber-400 transition-colors"
                >
                    Home
                </a>
            </nav>

            <main class="mt-8">
                <router-outlet />
            </main>
        </section>
    `,
    styles: `
        :host {
            max-width: 1280px;
            margin: 0 auto;
        }
    `,
})
export class AppComponent {}
