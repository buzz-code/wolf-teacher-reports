import Group from "../models/group.model";
import Teacher from "../models/teacher.model";
import AttType from "../models/att-type.model";
import User from "../models/user.model";
import StudentGroup from "../models/student-group.model";
import Lesson from "../models/lesson.model";

export function getUserByPhone(phone_number) {
    return new User({ phone_number })
        .fetch()
        .then(res => res.toJSON());
}

export function getTeacherByUserIdAndPhone(user_id, phone) {
    return new Teacher({ user_id, phone })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function getKlassByUserIdAndKlassId(user_id, id) {
    return new Group({ user_id, id })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function getLessonByUserIdAndLessonId(user_id, id) {
    return new Lesson({ user_id, id })
        .fetch({ require: false })
        .then(res => res ? res.toJSON() : null);
}

export function getStudentsByUserIdAndKlassId(user_id, group_id) {
    return new StudentGroup({ user_id, group_id })
        .fetchAll({ withRelated: ['student'] })
        .then(res => res.toJSON())
        .then(res => res.map(item => item.student));
}

export function getAttTypesByUserId(user_id) {
    return new AttType({ user_id })
        .fetchAll()
        .then(res => res.toJSON());
}
