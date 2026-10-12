import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const serverEnv = {
  get apiUrl() {
    return required("API_URL").replace(/\/$/, "");
  },
  get apiKey() {
    return required("API_KEY");
  },
  get revalidateSecret() {
    return required("REVALIDATE_SECRET");
  },
};
