import { Link } from '@remix-run/react';

export default function News({ articles }) {
  return (
    <>
      <h1 className="font-bold text-2xl">Latest News</h1>
      <hr className="border-gray-400" />
      {articles.map((article) => (
        <Preview article={article} key={article.name} />
      ))}
    </>
  );
}

function Preview({ article }) {
  const { title, date, description } = article;

  return (
    <article className="mb-6">
      <div className="text-gray-400">{date}</div>
      <Link to={`/news/${article.name}`} className="text-2xl">
        {title}
      </Link>
      <p className="mt-2">{description}</p>
    </article>
  );
}
