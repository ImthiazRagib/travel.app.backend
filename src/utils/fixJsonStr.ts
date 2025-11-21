export function fixJsonString(str: string): string {
  // Already valid JSON (starts with { and uses double quotes)
  if (/^\s*{[\s\S]*}\s*$/.test(str) && str.includes('"')) {
    return str;
  }

  // Replace keys and values safely
  return str
    .replace(/(['"])?([a-zA-Z0-9_]+)\1(?=\s*:)/g, '"$2"')  // keys → "key"
    .replace(/'([^']*)'/g, '"$1"');                        // values → "value"
}