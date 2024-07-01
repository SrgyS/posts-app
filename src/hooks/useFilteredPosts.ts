import { Post } from '../modules/posts/posts.slice';
import { useMemo } from 'react';

type UseFilteredPostsProps = {
    posts: Post[];
    searchText: string;
    showFavorites: boolean;
    favoritePosts: number[];
};
export const useFilteredPosts = ({
    posts,
    searchText,
    showFavorites,
    favoritePosts,
}: UseFilteredPostsProps) => {
    return useMemo(() => {
        let filteredPosts = posts;
        if (searchText) {
            filteredPosts = filteredPosts.filter(
                (post) =>
                    post.title
                        .toLowerCase()
                        .indexOf(searchText.toLowerCase()) !== -1
            );
        }
        if (showFavorites) {
            filteredPosts = filteredPosts.filter((post) =>
                favoritePosts.includes(post.id)
            );
        }
        return filteredPosts;
    }, [posts, searchText, showFavorites, favoritePosts]);
};
