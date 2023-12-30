// TODO: the difference between object and Object and {} and Record
export function isObject(target: unknown): target is Record<any, any> {
  return target !== null && typeof target === "object";
}
