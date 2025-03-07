import bookshelf from "../../common-modules/server/config/bookshelf";
import { Teacher, AttReport, User, Question, Answer, WorkingDate, Student, Price, SalaryReport } from "../models";

import moment from 'moment';

export function getUserByPhone(phone_number) {
    return new User().where({ phone_number })
        .fetch()
        .then(res => res.toJSON());
}

export function getTeacherByUserIdAndPhone(user_id, phone) {
    return new Teacher().where({ 'teachers.user_id': user_id, phone })
        .query(qb => {
            qb.leftJoin('teacher_types', { 'teacher_types.key': 'teachers.teacher_type_id', 'teacher_types.user_id': 'teachers.user_id' })
            qb.select('teachers.*')
            qb.select({ teacher_type_name: 'teacher_types.name' })
        })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function getReportsByTeacherIdAndToday(user_id, teacher_id, report_date) {
    return new AttReport().where({ user_id, teacher_id, report_date })
        .fetchAll()
        .then(result => result.toJSON());
}

export function getUnconfirmedPreviousReportsByTeacherAndDates(user_id, teacher_id, start_report_date, end_report_date) {
    return new AttReport().where({ user_id, teacher_id })
        .where('report_date', '>=', start_report_date.format('YYYY-MM-DD'))
        .where('report_date', '<=', end_report_date.format('YYYY-MM-DD'))
        .where(bookshelf.knex.raw('COALESCE(is_confirmed, 0)'), '=', 0)
        .fetchAll()
        .then(result => result.toJSON());
}

export function saveReportAsConfirmed(id) {
    return new AttReport().query()
        .where({ id })
        .update({ is_confirmed: 1 });
}

export function updateSalaryMonthByUserId(user_id, ids, salary_month) {
    return new AttReport().query()
        .where({ user_id })
        .whereIn('id', ids)
        .update({ salary_month });
}

export function updateSalaryCommentByUserId(user_id, id, comment) {
    if (id?.includes?.(',')) {
        return new AttReport().query()
            .where({ user_id })
            .whereIn('id', id.split(','))
            .update({ comment });
    }
    return new AttReport().query()
        .where({ user_id, id })
        .update({ comment });
}

export async function getQuestionsForTeacher(user_id, teacher_id, teacher_type_id, teacher_special_question) {
    const [answers, questions] = await Promise.all([
        new Answer()
            .where({ user_id, teacher_id })
            .fetchAll()
            .then(result => result.toJSON()),
        new Question()
            .where({ 'questions.user_id': user_id, teacher_type_id })
            .where('start_date', '<=', moment().format('YYYY-MM-DD'))
            .where('end_date', '>=', moment().format('YYYY-MM-DD'))
            .query(qb => {
                qb.leftJoin('question_types', 'question_types.key', 'questions.question_type_id')
                qb.select('questions.*')
                qb.select({ question_type_key: 'question_types.key' })
            })
            .fetchAll()
            .then(result => result.toJSON())
    ]);

    const answerByQuestion = {};
    answers.forEach(ans => {
        if (!answerByQuestion[ans.question_id]) {
            answerByQuestion[ans.question_id] = [[false, false]];
        }
        answerByQuestion[ans.question_id][Number(!!Number(ans.answer))] = true;
    });
    return questions.filter(question => {
        const FALSE = 0, TRUE = 1;
        const questionTypeValidators = {
            1: answer => !answer?.[FALSE] && !answer?.[TRUE],
            2: answer => !answer?.[TRUE],
            3: answer => !answer?.[FALSE],
            4: (answer, questionId) => teacher_special_question == questionId && !answer?.[FALSE] && !answer?.[TRUE],
        };

        return questionTypeValidators[question.question_type_key]?.(
            answerByQuestion[question.id], 
            question.id
        ) ?? false;
    });
}

export function saveAnswerForQuestion(user_id, teacher_id, question_id, answer) {
    return new Answer({
        user_id,
        teacher_id,
        question_id,
        answer,
        answer_date: moment().format('YYYY-MM-DD')
    })
        .save();
}

export function updateReportIdForExistingReportAnswers(previous_report_id, report_id) {
    return new Answer().query()
        .where({ report_id: previous_report_id })
        .update({ report_id });
}

export function updateReportIdForAnswers(user_id, teacher_id, report_id) {
    return new Answer().query()
        .where({ user_id, teacher_id, answer_date: moment().format('YYYY-MM-DD') })
        .where({ report_id: null })
        .update({ report_id });
}

export function getAbsencesCountForTeacher(user_id, teacher_id, report_date) {
    return new AttReport().where({ user_id, teacher_id })
        .query()
        .whereBetween('report_date', [
            moment(report_date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD'),
            moment(report_date, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
        ])
        .sum({ sum: 'how_many_lessons_absence' })
        .then(res => res[0].sum);
}

export async function validateWorkingDateForTeacher(user_id, teacher_type_id, report_date) {
    return new WorkingDate()
        .where({ user_id, teacher_type_id, working_date: report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getTeachersByFourLastDigits(user_id, four_last_digits) {
    return new Teacher()
        .where({ user_id })
        .where('phone', 'like', `%${four_last_digits}`)
        .fetchAll()
        .then(result => result.toJSON());
}

export async function getStudentByTz(user_id, tz) {
    return new Student()
        .where({ user_id, tz })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export async function getPrices(user_id) {
    const data = await new Price()
        .where({ user_id })
        .fetchAll()
        .then(result => result.toJSON());
    const dict = data.reduce((a, b) => ({ ...a, [b.key]: b.price }), {});
    return dict;
}

export async function createSalaryReportByUserId(user_id, ids) {
    const salaryReport = await new SalaryReport({
        user_id,
        ids: ids.toString(),
        date: new Date()
    })
        .save();
    const reports = await new AttReport().query()
        .where({ user_id })
        .whereIn('id', ids.split(','))
        .update({ salaryReport: salaryReport.id });
}
