export function ProseContainer({ children, className = '' }) {
  return (
    // biome-ignore lint/nursery/useSortedClasses: does not interpolate well
    <article className={`prose ${className}`}>{children}</article>
  );
}
