/**
 * Formate une date en format français
 */
export const formatDate = (
  dateString: string | Date | null | undefined
): string => {
  if (!dateString) return "Non définie";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  } catch (error) {
    return "Format invalide";
  }
};

/**
 * Tronque un texte s'il dépasse une certaine longueur
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50
): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
