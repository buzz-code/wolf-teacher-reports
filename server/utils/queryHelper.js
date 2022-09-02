import Teacher from "../models/teacher.model";
import AttReport from "../models/att-report.model";
import User from "../models/user.model";
import Question from "../models/question.model";
import Answer from "../models/answer.model";
import WorkingDate from "../models/working-date.model";

import moment from 'moment';

export function getUserByPhone(phone_number) {
    return new User().where({ phone_number })
        .fetch()
        .then(res => res.toJSON());
}

export function getTeacherByUserIdAndPhone(user_id, phone) {
    return new Teacher().where({ user_id, phone })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function getReportByTeacherIdAndToday(user_id, teacher_id, report_date) {
    return new AttReport().where({ user_id, teacher_id, report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function updateSalaryMonthByUserId(user_id, ids, salary_month) {
    return new AttReport().query()
        .where({ user_id, salary_month: null })
        .whereIn('id', ids)
        .update({ salary_month });
}

export function updateSalaryCommentByUserId(user_id, id, comment) {
    return new AttReport().query()
        .where({ user_id, id })
        .update({ comment });
}

export async function getQuestionsForTeacher(user_id, teacher_id) {
    const [answers, questions] = await Promise.all([
        new Answer()
            .where({ user_id, teacher_id })
            .fetchAll()
            .then(result => result.toJSON()),
        new Question()
            .where({ 'questions.user_id': user_id })
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
        answerByQuestion[ans.question_id][ans.answer] = true;
    });
    return questions.filter(question => {
        return question.question_type_key == 1 ||
            question.question_type_key == 2 && answerByQuestion[question.id]?.[1] == false ||
            question.question_type_key == 3 && answerByQuestion[question.id]?.[0] == false
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

export function getAbsencesCountForTeacher(user_id, teacher_id, report_date) {
    return new AttReport().where({ user_id, teacher_id })
        .query()
        .whereBetween('report_date', [moment(report_date, 'YYYY-MM-DD').startOf('month'), moment(report_date, 'YYYY-MM-DD').endOf('month')])
        .sum({ sum: 'how_many_lessons_absence' })
        .then(res => res[0].sum);
}

export async function validateWorkingDateForTeacher(user_id, teacher_type_id, report_date) {
    return new WorkingDate()
        .where({ user_id, teacher_type_id, working_date: report_date })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}
