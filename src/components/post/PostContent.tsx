import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  const authorName = post.author?.node?.name || 'Staff Writer';
  const publishDate = formatDate(post.date);
  const readingTime = post.postExtended?.readingTime || 5;

  return (
    <article className="post-content-sec">
      <div className="post-content-container">
        {/* Meta Info */}
        <div className="post-content-meta">
          <p className="post-content-author">
            Essay by {authorName}
          </p>
          <div className="post-content-date-row">
            <span>{publishDate}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Content Body */}
        {post.content && (
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {/* Pull Quote Block (if defined in ACF and not already in content) */}
        {post.postExtended?.pullQuote && (
          <blockquote className="post-content-quote">
            <p className="post-content-quote-text">
              &ldquo;{post.postExtended.pullQuote}&rdquo;
            </p>
          </blockquote>
        )}
      </div>
    </article>
  );
}
