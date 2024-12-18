export default interface PostAttributes {
    title: string;
    slug: string;
    description: string;
    date: string;
    coverImage?: string;
    tags?: string[];
    draft?: boolean;
}
