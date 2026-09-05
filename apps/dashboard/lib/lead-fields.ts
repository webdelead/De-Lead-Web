/**
 * The lead form's free-text `interest` field is reused per site for whatever
 * that site actually asks — a course interest on the hub, a class/grade on the
 * camps. This maps the vertical key to the right column label so a scoped
 * Leads screen doesn't say "Interest" over a list of grade numbers.
 */
const INTEREST_LABEL: Record<string, string> = {
  makerchamps: "Class",
  tinkerchamps: "Class",
};

export function interestLabel(vertical?: string | null): string {
  return (vertical && INTEREST_LABEL[vertical]) || "Interest";
}
