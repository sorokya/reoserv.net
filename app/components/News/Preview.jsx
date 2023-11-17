import { Link } from '@remix-run/react';

export default function Preview({ article }) {
  const { title, date, description } = article;

  return (
    <article className="mb-6">
      <span className="text-gray-400 block">{date}</span>
      <Link to={`/news/${article.name}`} className="text-2xl">
        {title}
      </Link>
      <p className="mt-2">{description}</p>
    </article>
  );
}
