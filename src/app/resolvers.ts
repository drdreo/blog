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

export const postTitleResolver: ResolveFn<string> = (route) => injectActivePostAttributes(route).title + ' | DrDreo';

export const postMetaResolver: ResolveFn<MetaTag[]> = (route) => {
    const postAttributes = injectActivePostAttributes(route);
    // Use absolute URL to improve coverage of preview images
    const domain = 'https://blog.drdreo.com';
    const imageUrl = postAttributes.coverImage ? `${domain}${postAttributes.coverImage}` : null;

    const publishTime = new Date(postAttributes.date).toISOString();

    return [
        {
            name: 'author',
            content: 'DrDreo'
        },
        {
            name: 'article:author',
            content: 'DrDreo'
        },
        {
            name: 'description',
            content: postAttributes.description
        },
        {
            property: 'article:published_time',
            content: publishTime
        },
        {
            property: 'og:title',
            content: postAttributes.title + ' | DrDreo'
        },
        {
            property: 'og:type',
            content: 'article'
        },
        {
            property: 'og:description',
            content: postAttributes.description
        },
        {
            property: 'og:url',
            content: `${domain}/${route.params['slug']}`
        },
        ...(imageUrl
            ? [
                  {
                      property: 'og:image',
                      content: imageUrl
                  },
                  {
                      property: 'twitter:image',
                      content: imageUrl
                  }
              ]
            : [])
    ];
};
