import Preview from './Preview';

export default function News({ articles }) {
  return (
    <>
      <h1 className="font-bold text-2xl">Latest News</h1>
      <hr className="border-gray-400" />
      {articles.map(
        (article) => (
          <Preview article={article} key={article.name} />
        ),
        [],
      )}
    </>
  );
}
