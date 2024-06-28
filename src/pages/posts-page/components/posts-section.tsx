import { Post } from '../../../modules/posts/posts.slice';
import { PostItem } from '../../../modules/posts/components/post-item';
import { User } from '../../../modules/users/users.slice';
import s from './posts-section.module.css';
type PostsSectionProps = {
    posts: Post[];
    checkedPosts: number[];
    onCheckPost: (postId: number) => void;
    users: User[];
};
export const PostsSection = ({
    posts,
    checkedPosts,
    onCheckPost,
    users,
}: PostsSectionProps) => {
    return (
        <section className={s.section}>
            <ul>
                {posts?.map((post: Post) => (
                    <PostItem
                        post={post}
                        key={post.id}
                        checkedPosts={checkedPosts}
                        onCheckPost={onCheckPost}
                        users={users || []}
                    />
                ))}
            </ul>
        </section>
    );
};
