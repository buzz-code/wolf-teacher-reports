/**
 * Add lesson_number column to att_reports.
 *
 * Allows per-lesson attendance reporting and per-lesson duplicate prevention.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('att_reports', table => {
        table.integer('lesson_number').nullable();
    });
};

/**
 * Drop lesson_number column from att_reports.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.table('att_reports', table => {
        table.dropColumn('lesson_number');
    });
};
