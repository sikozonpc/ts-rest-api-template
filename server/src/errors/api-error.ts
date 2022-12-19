export type Code = keyof typeof errors;

const errors = Object.freeze({
  "ERR-001": "{#key} does not exist",
  "ERR-002": "{#key} already exists",
  "ERR-003": "{#key} is required",
  "ERR-004": "{#key} is not valid",
})

export function getErrorDescription(code: Code, key?: string): string {
  const errorDescription = errors[code];
  const description = `${code}: ${errorDescription}`;

  if (!key) return description;
  return description.replace("{#key}", key);
}

export class ErrorCode extends Error {
  code: Code;
  constructor(code: Code, key?: string) {
    const message = getErrorDescription(code, key);
    super(message);
    this.code = code;
  }
}