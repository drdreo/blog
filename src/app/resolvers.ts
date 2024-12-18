import { injectContentFiles } from '@analogjs/content';
import { MetaTag } from '@analogjs/router';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import PostAttributes from './post-attributes';

// temporary
export function injectActivePostAttributes(route: ActivatedRouteSnapshot): PostAttributes {
    const file = injectContentFiles<PostAttributes>().find((contentFile) => {
        return (
            contentFile.filename === `/src/content/${route.params['slug']}.md` ||
            contentFile.slug === route.params['slug']
        );
    });

    return file!.attributes;
}

export const postTitleResolver: ResolveFn<string> = (route) => injectActivePostAttributes(route).title;

export const postMetaResolver: ResolveFn<MetaTag[]> = (route) => {
    const postAttributes = injectActivePostAttributes(route);
    const imageUrl = postAttributes.coverImage;

    return [
        {
            name: 'description',
            content: postAttributes.description,
        },
        {
            name: 'author',
            content: 'DrDreo',
        },
        {
            property: 'og:title',
            content: postAttributes.title,
        },
        {
            property: 'og:description',
            content: postAttributes.description,
        },

        ...(imageUrl
            ? [
                  {
                      property: 'og:image',
                      content: imageUrl,
                  },
                  {
                      property: 'twitter:image',
                      content: imageUrl,
                  },
              ]
            : []),
    ];
};
