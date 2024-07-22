import { styles } from "@/registry/styles";

export async function GET() {
  return new Response(JSON.stringify(styles, null, 2));
}
