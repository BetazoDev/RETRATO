import Link from 'next/link';
import type { Post } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';

interface PostListViewProps {
  posts: Post[];
}

export default function PostListView({ posts }: PostListViewProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center opacity-50 font-bold tracking-widest uppercase text-xs">
        No entries found in this archive collection.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table Header Row */}
      <div className="arc-list-header">
        <div className="arc-col-title">Project Title</div>
        <div className="arc-col-author">Photographer</div>
        <div className="arc-col-format">Format</div>
        <div className="arc-col-stock">Stock</div>
        <div className="arc-col-date">Date</div>
      </div>

      {/* Table Rows */}
      <div className="flex flex-col">
        {posts.map((post) => {
          const camera = post.postExtended?.technicalSheet?.camera || '35mm';
          const filmStock = post.postExtended?.technicalSheet?.filmStock || 'HP5';
          const author = post.author?.node?.name || 'Staff';
          const date = formatDateShort(post.date);

          return (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="arc-list-row"
            >
              <div className="arc-col-title">{post.title}</div>
              <div className="arc-col-author">{author}</div>
              <div className="arc-col-format">{camera}</div>
              <div className="arc-col-stock">{filmStock}</div>
              <div className="arc-col-date">{date}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
