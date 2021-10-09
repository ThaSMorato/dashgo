import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement } from "react";

interface AvtiveLinkProps extends LinkProps {
  children: React.ReactElement;
  shouldMatchExactHref?: boolean;
}

export const ActiveLink = ({
  shouldMatchExactHref = false,
  children,
  ...rest
}: AvtiveLinkProps) => {
  let isActive = false;

  const { asPath } = useRouter();

  if (shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true;
  }

  if (
    !shouldMatchExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true;
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive ? "pink.400" : "gray.50",
      })}
    </Link>
  );
};
