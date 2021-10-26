import bookshelf from '../../common-modules/server/config/bookshelf';
import { lessonsCount, studentsCount } from './constantsHelper';
import { seminarKitaPrices } from './pricesHelper';

const student_columns = new Array(studentsCount).fill(0)
    .flatMap((a, studentIndex) => new Array(lessonsCount).fill(0)
        .map((b, lessonIndex) => `student_${studentIndex + 1}_${lessonIndex + 1}_att_type`));

const seminarKitaPriceDict = {
    1: seminarKitaPrices.watch,
    2: seminarKitaPrices.teach,
    3: seminarKitaPrices.discuss,
    4: seminarKitaPrices.absence,
};

function getSeminarKitaSelector(lessonType) {
    return bookshelf.knex.raw('(' +
        student_columns.map(item => 'COALESCE(' + item + ', 0) = ' + lessonType).join(') + (')
        + ')');
}

export function getSeminarKitaLessonCount(lessonCount) {
    const res = {};
    for (var i = 1; i <= lessonCount; i++) {
        res['lesson_' + i] = getSeminarKitaSelector(i);
    }
    return res;
}

export function getSeminarKitaTotalPay(lessonCount) {
    const query = [];
    for (var i = 1; i <= lessonCount; i++) {
        query.push('(SELECT lesson_' + i + ') * ' + seminarKitaPriceDict[i]);
    }

    return bookshelf.knex.raw('(' + query.join(' + ') + ')');
}
