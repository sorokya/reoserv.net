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
        <li>
          <Link href="#top">
            Top{' '}
            <span className="text-xs" aria-hidden="true">
              ⤴
            </span>
          </Link>
        </li>
        {filteredToc.map((item) => (
          <li key={item.id}>
            <Link href={`#${item.id}`}>
              {item.level === 3 ? (
                <span className="text-xs pl-2 pr-1" aria-hidden="true">
                  ⤷
                </span>
              ) : null}
              {item.raw}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Link(props: React.ComponentProps<'a'>) {
  return (
    <a
      className="line-clamp-1 text-amber-11 text-sm transition-colors duration-100 hover:font-semibold"
      {...props}
    />
  );
}

export { TableOfContents };
