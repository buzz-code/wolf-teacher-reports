import bookshelf from '../../common-modules/server/config/bookshelf';

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

    /**
     * Table has timestamps.
     */
    // get hasTimestamps() {
    //     return true;
    // }
}

export default AttReport;