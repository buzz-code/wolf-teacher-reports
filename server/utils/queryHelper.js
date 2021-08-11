import Teacher from "../models/teacher.model";
import AttReport from "../models/att-report.model";
import User from "../models/user.model";

export function getUserByPhone(phone_number) {
    return new User().where({ phone_number })
        .fetch()
        .then(res => res.toJSON());
}

export function getTeacherByUserIdAndPhone(user_id, phone) {
    return new Teacher().where({ user_id, phone })
        .fetch({ require: false, withRelated: ['student1', 'student2', 'student3'] })
        .then(res => res ? res.toJSON() : null);
}

export function getReportByTeacherIdAndToday(user_id, teacher_id) {
    return new AttReport().where({ user_id, teacher_id, report_date: new Date() })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

