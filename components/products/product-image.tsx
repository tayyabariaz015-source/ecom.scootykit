import Image, { type ImageProps } from "next/image";

/** next/image wrapper: local SVG illustrations are served as-is (no optimiser). */
export function ProductImg(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized={props.unoptimized ?? src.endsWith(".svg")} />;
}
