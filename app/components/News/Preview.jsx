import { Link } from '@remix-run/react';

export default function Preview({ article }) {
  const { title, publishedAt, summary } = article;

  return (
    <article className="mb-6">
      <span className="text-gray-400 block">{publishedAt}</span>
      <Link to={`/news/${article.id}`} className="text-2xl">
        {title}
      </Link>
      <p className="mt-2">{summary}...</p>
    </article>
  );
}
