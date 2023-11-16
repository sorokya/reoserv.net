import Preview from './Preview';

export default function News({ articles }) {
  return (
    <>
      <h1 className="text-2xl font-bold">Latest News</h1>
      <hr className="border-gray-400" />
      {articles.map(
        (article) => (
          <Preview article={article} key={article.id} />
        ),
        [],
      )}
    </>
  );
}
