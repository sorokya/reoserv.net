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
      <div className="text-sand-11 text-xs dark:text-sanddark-11">{date}</div>
      <Link to={`/news/${article.name}`} className="group" prefetch="intent">
        <h2 className="font-bold text-lg text-sand-12 transition dark:group-hover:text-amberdark-11 dark:text-sanddark-12 group-hover:text-amber-11">
          {title}
        </h2>
        <p className="line-clamp-2 text-pretty text-sand-11 transition dark:group-hover:text-amberdark-11 dark:text-sanddark-11 group-hover:text-amber-11">
          {description}
        </p>
      </Link>
    </article>
  );
}
