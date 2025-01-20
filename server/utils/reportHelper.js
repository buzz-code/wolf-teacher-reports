import bookshelf from '../../common-modules/server/config/bookshelf';
import { trainingPrices } from './pricesHelper';

export function getCoalesceAndPrice(column, price) {
    return `COALESCE(${column}, 0) * ${price ?? 0}`;
}

export function getAnswersPrice() {
    return getCoalesceAndPrice('answers_price.answers_price', 1);
}

function joinMultiplePrices(...args) {
    return '(' + args.join(' + ') + ')';
}

export function getTotalPayForAllTeachers(prices, withExtra = true) {
    function getCaseOneLike(number) {
        return `WHEN teachers.teacher_type_id = ${number} THEN ${getTotalPay(number, prices, withExtra)}`
    }

    return bookshelf.knex.raw(`
        CASE
            ${getCaseOneLike(1)}
            ${getCaseOneLike(2)}
            ${getCaseOneLike(3)}
            ${getCaseOneLike(4)}
            ${getCaseOneLike(5)}
            ${getCaseOneLike(6)}
            ${getCaseOneLike(7)}
        END
    `)
}


export function getTotalPay(teacher_type_id, prices, withExtra = true) {
    switch (teacher_type_id) {
        case 1:
            return getSeminarKitaTotalPay(prices, withExtra);
        case 2:
            return getTrainingTeacherSalary(withExtra);
        case 3:
            return getManhaTotalPay(prices, withExtra);
        case 4:
            return '0';
        case 5:
            return getPdsTotalPay(prices, withExtra);
        case 6:
            return getKindergartenTotalPay(prices, withExtra);
        case 7:
            return getSpecialEducationTotalPay(prices, withExtra);
    }
}


export function getTrainingTeacherSalary(withExtra) {
    return joinMultiplePrices(
        getCoalesceAndPrice('how_many_watched', trainingPrices.watch),
        getCoalesceAndPrice('how_many_student_teached', trainingPrices.teach),
        getCoalesceAndPrice('was_discussing', trainingPrices.discuss),
        getCoalesceAndPrice('how_many_private_lessons', trainingPrices.privateLesson),
        withExtra ? getAnswersPrice() : '0',
    );
}

export function getSeminarKitaTotalPay(prices, withExtra) {
    return joinMultiplePrices(
        joinMultiplePrices(
            getCoalesceAndPrice('how_many_watch_or_individual', prices[11]),
            getCoalesceAndPrice('how_many_teached_or_interfering', prices[12]),
            getCoalesceAndPrice('how_many_discussing_lessons', prices[13]),
            getCoalesceAndPrice('was_kamal', prices[14]),
            getCoalesceAndPrice('how_many_lessons_absence', prices[15]),
        ) + ' * (0.5 * COALESCE(how_many_students, 0))',
        withExtra ? getAnswersPrice() : '0',
    );
}

export function getManhaTotalPay(prices, withExtra) {
    return joinMultiplePrices(
        getCoalesceAndPrice('how_many_watched_lessons', prices[51]),
        getCoalesceAndPrice('how_many_students_teached', prices[52]),
        getCoalesceAndPrice('how_many_yalkut_lessons', prices[53]),
        getCoalesceAndPrice('how_many_discussing_lessons', prices[54]),
        getCoalesceAndPrice('how_many_students_help_teached', prices[55]),
        getCoalesceAndPrice('how_many_methodic', prices[56]),
        getCoalesceAndPrice('is_taarif_hulia', prices[57]),
        getCoalesceAndPrice('is_taarif_hulia2', prices[58]),
        getCoalesceAndPrice('is_taarif_hulia3', prices[59]),
        withExtra ? getAnswersPrice() : '0',
    );
}

export function getPdsTotalPay(prices, withExtra) {
    return joinMultiplePrices(
        getCoalesceAndPrice('how_many_watch_or_individual', prices[40]),
        getCoalesceAndPrice('how_many_teached_or_interfering', prices[42]),
        getCoalesceAndPrice('how_many_discussing_lessons', prices[41]),
        withExtra ? getAnswersPrice() : '0',
    );
}

export function getSpecialEducationTotalPay(prices, withExtra) {
    return joinMultiplePrices(
        getCoalesceAndPrice('how_many_lessons', 1) + '*' + getCoalesceAndPrice('how_many_students_watched', 1) + '*' + (prices[26] ?? 0),
        getCoalesceAndPrice('how_many_students_teached', prices[27]),
        getCoalesceAndPrice('was_phone_discussing', prices[28]),
        withExtra ? getAnswersPrice() : '0',
    );
}

export function getKindergartenTotalPay(prices, withExtra) {
    return joinMultiplePrices(
        getCoalesceAndPrice('was_collective_watch', prices[60]),
        getCoalesceAndPrice('how_many_students', prices[24]),
        getCoalesceAndPrice('was_discussing', prices[25]),
        withExtra ? getAnswersPrice() : '0',
    );
}