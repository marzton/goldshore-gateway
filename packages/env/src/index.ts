export * from "./schema";
import { environmentSchema } from "./schema";

export const parseEnv = (env: unknown) => {
    return environmentSchema.parse(env);
}
