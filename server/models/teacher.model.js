import bookshelf from '../config/bookshelf';
import User from './user.model';

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

    user() {
        return this.belongsTo(User);
    }
}

export default Teacher;