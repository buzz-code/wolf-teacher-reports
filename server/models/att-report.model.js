import bookshelf from '../../common-modules/server/config/bookshelf';
import AttType from './att-type.model';
import LessonTime from './lesson-time.model';
import Lesson from './lesson.model';
import Student from './student.model';
import Teacher from './teacher.model';
import User from './user.model';

const TABLE_NAME = 'att_reports';

/**
 * AttReport model.
 */
class AttReport extends bookshelf.Model {

    /**
     * Get table name.
     */
    get tableName() {
        return TABLE_NAME;
    }

    // get hasTimestamps() {
    //     return true;
    // }

    user() {
        return this.belongsTo(User);
    }

    student() {
        return this.belongsTo(Student);
    }

    teacher() {
        return this.belongsTo(Teacher);
    }

    lesson() {
        return this.belongsTo(Lesson);
    }

    lessonTime() {
        return this.belongsTo(LessonTime);
    }

    attType() {
        return this.belongsTo(AttType);
    }
}

export default AttReport;