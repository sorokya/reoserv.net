const baseClasses = `
  prose 
  max-w-[75ch] 
  prose-table:w-auto 
  prose-table:min-w-[60%] 
  prose-table:max-w-full 
  prose-pre:text-[1em]
  prose-pre:rounded-sm
  prose-code:text-[1em]
`;

export function ProseContainer({ children, className = '' }) {
  return (
    // biome-ignore lint/nursery/useSortedClasses: does not interpolate well
    <article className={`${baseClasses} ${className}`}>{children}</article>
  );
}
