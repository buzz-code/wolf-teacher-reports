import bookshelf from '../../common-modules/server/config/bookshelf';
import User from './user.model';

const TABLE_NAME = 'students';

/**
 * Student model.
 */
class Student extends bookshelf.Model {

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
}

export default Student;