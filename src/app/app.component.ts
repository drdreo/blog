import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent],
    template: `
        <section class="mx-auto max-w-3xl px-4 sm:px-6 xl:px-0 relative">
            <blog-nav />

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
