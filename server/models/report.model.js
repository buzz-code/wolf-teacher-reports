import bookshelf from '../config/bookshelf';
import User from './user.model';

const TABLE_NAME = 'reports';

/**
 * Report model.
 */
class Report extends bookshelf.Model {

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

export default Report;