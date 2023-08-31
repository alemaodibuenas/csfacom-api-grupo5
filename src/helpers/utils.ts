const datePatternRegex = /\b\d{1,2}(?:\/\d{1,2})?(?:\/\d{2,4})?\b/g;
const regexMoeda =
  /(?<=\s|^)(\d{1,3}(?:\.\d{3})*),(\d{2})(?=\s|$)|(?<=\s|^)(\d+),(\d{2})(?=\s|$)/g;

export const convertNumberOrDate = (str: string): string => {
  const valorNumerico = str.match(regexMoeda);
  if (valorNumerico) {
    const valorSemFormatacao = valorNumerico[0]
      .replace(/\./g, '')
      .replace(',', '.');
    return valorSemFormatacao;
  }

  const dataMatch = str.match(datePatternRegex);
  if (dataMatch && dataMatch.length > 0) {
    const dateParts = dataMatch[0].split('/');
    return dateParts.reverse().join('-');
  }

  return str;
};
