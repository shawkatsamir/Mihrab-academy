import { defineConfig } from "sanity";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structureTool } from "sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error("Missing env var: NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export default defineConfig({
  name: "mihrab",
  title: "Mihrab Content Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
