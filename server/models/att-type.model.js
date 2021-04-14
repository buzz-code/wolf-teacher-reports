import bookshelf from '../config/bookshelf';
import User from './user.model';

const TABLE_NAME = 'att_types';

/**
 * AttType model.
 */
class AttType extends bookshelf.Model {

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

export default AttType;