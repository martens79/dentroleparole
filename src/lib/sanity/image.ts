import imageUrlBuilder from "@sanity/image-url";
import { publicClient } from "@/lib/sanity/publicClient";

const builder = imageUrlBuilder(publicClient);

export function urlFor(source: any) {
  return builder.image(source);
}