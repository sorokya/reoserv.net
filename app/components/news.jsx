import { Link } from '@remix-run/react';

export function News({ articles }) {
  return (
    <ul className="grid gap-8">
      {articles.map((article) => (
        <li key={article.name}>
          <Preview article={article} />
        </li>
      ))}
    </ul>
  );
}

function Preview({ article }) {
  const { title, date, description } = article;

  return (
    <article>
      <div className="text-gray-11 text-xs">{date}</div>
      <Link to={`/news/${article.name}`} className="group" prefetch="intent">
        <h2 className="font-bold text-gray-12 text-lg transition group-hover:text-accent-11">
          {title}
        </h2>
        <p className="line-clamp-2 text-pretty text-gray-11 transition group-hover:text-accent-11">
          {description}
        </p>
      </Link>
    </article>
  );
}
