const startOfYear = new Date('2000-08-01');
const startOfAvailableYear = new Date('2000-06-01');
const firstAvailableYear = 5782;

const getCurrentGregorianYearByStartDate = (yearStartDate) => {
    const now = new Date();
    const year = now.getFullYear();
    const isNextYear = now.getMonth() > yearStartDate.getMonth() ||
        now.getMonth() === yearStartDate.getMonth() && now.getDate() >= yearStartDate.getDate();
    return year + (isNextYear ? 1 : 0);
}

const getHebrewYearByGregorianYear = (gregorianYear) => {
    return gregorianYear + 3760;
}

const getCurrentGregorianYear = () => {
    return getCurrentGregorianYearByStartDate(startOfYear);
}

const getLastAvailableGregorianYear = () => {
    return getCurrentGregorianYearByStartDate(startOfAvailableYear);
}

const tensLetterArr = [
    "י",
    "כ",
    "ל",
    "מ",
    "נ",
    "ס",
    "ע",
    "פ",
    "צ",
];
const getYearName = (year) => {
    const tensDigit = Math.floor((year % 100) / 10);
    const onesDigit = year % 10;
    const tensLetter = tensLetterArr[tensDigit - 1];
    const onesLetter = String.fromCharCode('א'.charCodeAt(0) + onesDigit - 1);
    return `תש${tensLetter}"${onesLetter}`;
}

const getYearList = () => {
    const firstYear = firstAvailableYear;
    const lastGregorianYear = getLastAvailableGregorianYear();
    const lastYear = getHebrewYearByGregorianYear(lastGregorianYear);

    const choices = [];
    for (let year = firstYear; year <= lastYear; year++) {
        choices.push({
            id: year,
            name: getYearName(year),
        });
    }
    return choices;
}

export const getYearsList = getYearList;

export const defaultYear = getYearList()[getYearList().length - 1].id;
