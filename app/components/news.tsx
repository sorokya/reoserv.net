import { Link } from 'react-router';

type NewsProps = {
  articles: Array<{
    title: string;
    key: string;
    description: string;
    date: string;
    localDate: string;
  }>;
};

function News({ articles }: NewsProps) {
  return (
    <ul className="grid gap-8">
      {articles.map((article) => (
        <li key={article.key}>
          <article>
            <time
              dateTime={article.date}
              className="block text-sand-11 text-xs"
            >
              {article.localDate}
            </time>
            <Link
              to={`/${article.key}`}
              className="group"
              prefetch="intent"
            >
              <h2 className="font-bold text-amber-12 text-lg transition group-hover:text-amber-11">
                {article.title}
              </h2>
              <p className="line-clamp-2 text-pretty text-sand-11 transition group-hover:text-amber-11">
                {article.description}
              </p>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}

export { News };
