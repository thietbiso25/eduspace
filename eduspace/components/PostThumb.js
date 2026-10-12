import Cover from './Cover';

// Ảnh bìa bài viết: dùng ảnh đã tải lên, nếu không có thì dùng ảnh bìa màu + emoji
export default function PostThumb({ post, tag }) {
  if (post.cover_url) {
    return (
      <div className="thumb">
        <img src={post.cover_url} alt={post.title} loading="lazy" />
        <span className="tag">{tag}</span>
      </div>
    );
  }
  return <Cover title={post.title} emoji={post.emoji} tag={tag} />;
}
