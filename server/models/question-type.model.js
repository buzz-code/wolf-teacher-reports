import bookshelf from '../../common-modules/server/config/bookshelf';
import User from './user.model';

const TABLE_NAME = 'question_types';

/**
 * QuestionType model.
 */
class QuestionType extends bookshelf.Model {

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

export default QuestionType;