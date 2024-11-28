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
    <nav className="sticky top-8 w-full border border-amber-6 border-dashed bg-amber-2 p-4 opacity-80 transition-all duration-100 hover:border-amber-9 hover:opacity-100">
      <ul className="space-y-2">
        {filteredToc.map((item) => (
          <li key={item.id} className={`${item.level === 3 ? 'ml-4' : ''}`}>
            <a
              href={`#${item.id}`}
              className="line-clamp-1 text-amber-11 text-sm transition-colors duration-100 hover:font-semibold"
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
