import bookshelf from '../../common-modules/server/config/bookshelf';
import User from './user.model';
import Student from './student.model';

const TABLE_NAME = 'teachers';

/**
 * Teacher model.
 */
class Teacher extends bookshelf.Model {

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

    student1() {
        return this.belongsTo(Student, 'student_tz_1', 'tz');
    }

    student2() {
        return this.belongsTo(Student, 'student_tz_2', 'tz');
    }

    student3() {
        return this.belongsTo(Student, 'student_tz_3', 'tz');
    }
}

export default Teacher;