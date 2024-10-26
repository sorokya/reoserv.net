import type * as React from 'react';

type ProseContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export function ProseContainer(props: ProseContainerProps) {
  const { className = '', children } = props;
  return <article className={`prose ${className}`}>{children}</article>;
}
