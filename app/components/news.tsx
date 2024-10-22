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
      <div className="text-sand-11 text-xs">{date}</div>
      <Link to={`/news/${article.name}`} className="group" prefetch="intent">
        <h2 className="font-bold text-amber-12 text-lg transition group-hover:text-amber-11">
          {title}
        </h2>
        <p className="line-clamp-2 text-pretty text-sand-11 transition group-hover:text-amber-11">
          {description}
        </p>
      </Link>
    </article>
  );
}
