import { colorsData } from "@/registry/colors";

export async function GET() {
  return new Response(JSON.stringify(colorsData(), null, 2));
}
