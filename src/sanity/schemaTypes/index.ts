// src/sanity/schemaTypes/index.ts
import post from "./post";

export const schemaTypes = [post];

// ✅ Sanity config si aspetta "schema"
export const schema = {
  types: schemaTypes,
};