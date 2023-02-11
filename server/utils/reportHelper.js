import bookshelf from '../../common-modules/server/config/bookshelf';
import { trainingPrices } from './pricesHelper';

export function getCoalesceAndPrice(column, price) {
    return `COALESCE(${column}, 0) * ${price}`;
}


export function getTrainingTeacherSalary() {
    return bookshelf.knex.raw([
        getCoalesceAndPrice('how_many_watched', trainingPrices.watch),
        getCoalesceAndPrice('how_many_student_teached', trainingPrices.teach),
        getCoalesceAndPrice('was_discussing', trainingPrices.discuss),
        getCoalesceAndPrice('how_many_private_lessons', trainingPrices.privateLesson),
    ].join(' + '))
}

export function getSeminarKitaTotalPay(prices) {
    return bookshelf.knex.raw([
        getCoalesceAndPrice('how_many_watch_or_individual', prices[11]),
        getCoalesceAndPrice('how_many_teached_or_interfering', prices[12]),
        getCoalesceAndPrice('how_many_discussing_lessons', prices[13]),
        getCoalesceAndPrice('was_kamal', prices[14]),
        getCoalesceAndPrice('how_many_lessons_absence', prices[15]),
    ].join(' + '))
}

export function getManhaTotalPay(prices) {
    return bookshelf.knex.raw([
        getCoalesceAndPrice('how_many_watched_lessons', prices[51]),
        getCoalesceAndPrice('how_many_students_teached', prices[52]),
        getCoalesceAndPrice('how_many_yalkut_lessons', prices[53]),
        getCoalesceAndPrice('how_many_discussing_lessons', prices[54]),
        getCoalesceAndPrice('how_many_students_help_teached', prices[55]),
    ].join(' + '))
}

export function getPdsTotalPay(prices) {
    return bookshelf.knex.raw([
        getCoalesceAndPrice('how_many_watch_or_individual', prices[40]),
        getCoalesceAndPrice('how_many_teached_or_interfering', prices[42]),
        getCoalesceAndPrice('how_many_discussing_lessons', prices[41]),
    ].join(' + '))
}

export function getSpecialEducationTotalPay(prices) {
    return bookshelf.knex.raw([
        getCoalesceAndPrice('how_many_lessons', 1) + '*' + getCoalesceAndPrice('how_many_students_watched', 1) + '*' + prices[26],
        getCoalesceAndPrice('how_many_students_teached', prices[27]),
        getCoalesceAndPrice('was_phone_discussing', prices[28]),
    ].join(' + '))
}

export function getKindergartenTotalPay(prices) {
    return bookshelf.knex.raw([
        getCoalesceAndPrice('how_many_students', prices[24]),
        getCoalesceAndPrice('was_discussing', prices[25]),
    ].join(' + '))
}