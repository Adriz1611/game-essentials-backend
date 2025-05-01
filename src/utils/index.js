export function shortenString(str, maxLength) {
    if (typeof str !== 'string') {
        throw new TypeError('Input must be a string');
    }
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - 3) + '...';
}

export function getStatusColors(status) {
    switch (status) {
      case "Active":
        return "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200";
      case "Inactive":
        return "bg-neutral-300/40 border-neutral-300";
      case "hold":
        return "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300";
      case "deleted":
        return "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10";
      default:
        throw new Error("Invalid status provided");
    }
}