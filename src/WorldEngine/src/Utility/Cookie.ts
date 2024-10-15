export function set(name: string, val: string) {
  const date = new Date();
  date.setTime(date.getTime() + (31 * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + val + "; expires=" + date.toUTCString() + "; path=/";
}

export function get(name: string): string | undefined {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts != undefined && parts.length == 2) {
    return parts.pop()!.split(";").shift();
  }

  return undefined;
}
