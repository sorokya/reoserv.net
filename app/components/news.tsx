import { Link } from 'react-router';

type Article = {
  title: string;
  name: string;
  description: string;
  date: string;
  localDate: string;
};

type NewsProps = {
  articles: Article[];
};

type PreviewProps = {
  article: Article;
};

function News({ articles }: NewsProps) {
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

function Preview({ article }: PreviewProps) {
  return (
    <article>
      <time dateTime={article.date} className="block text-sand-11 text-xs">
        {article.localDate}
      </time>
      <Link to={`/news/${article.name}`} className="group" prefetch="intent">
        <h2 className="font-bold text-amber-12 text-lg transition group-hover:text-amber-11">
          {article.title}
        </h2>
        <p className="line-clamp-2 text-pretty text-sand-11 transition group-hover:text-amber-11">
          {article.description}
        </p>
      </Link>
    </article>
  );
}

export { News };
