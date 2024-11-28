type TableOfContentsProps = {
  toc: Array<{
    level: number;
    id: string;
    text: string;
    raw: string;
  }>;
};

function TableOfContents({ toc }: TableOfContentsProps) {
  const filteredToc = toc.filter(
    (item) => item.level === 2 || item.level === 3,
  );

  if (filteredToc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-8 w-full border border-amber-6 border-dashed bg-amber-2 p-6 opacity-60 transition-opacity duration-200 hover:border-amber-9 hover:opacity-100">
      <ul className="space-y-2">
        {filteredToc.map((item) => (
          <li key={item.id} className={`${item.level === 3 ? 'ml-4' : ''}`}>
            <a
              href={`#${item.id}`}
              className="line-clamp-1 text-amber-11 text-sm transition-colors duration-200 hover:font-semibold hover:text-amber-12"
            >
              {item.raw}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { TableOfContents };
