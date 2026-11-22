/**
 * Ofek program: att_reports columns and phone texts.
 * Prices are per user and editable in the prices screen (keys 61, 62, 63), so they are not added here.
 */
const columns = [
    ['is_ofek', table => table.boolean('is_ofek').nullable()],
    ['ofek_lessons', table => table.integer('ofek_lessons').nullable()],
    ['ofek_discussing_lessons', table => table.integer('ofek_discussing_lessons').nullable()],
    ['ofek_meeting', table => table.boolean('ofek_meeting').nullable()],
];

const texts = [
    ['askOfekOrHulia', 'בחירת מסלול: אופק או חוליה', 'לדיווח על תוכנית אופק הקישי 1, לדיווח חוליה הקישי 2'],
    ['askOfekLessons', 'אופק: מספר שיעורים', 'כמה שיעורים צפית?'],
    ['askOfekDiscussingLessons', 'אופק: מספר שיעורי דיון', 'בכמה שיעורים היה דיון?'],
    ['askOfekMeeting', 'אופק: פגישת הערכה', 'האם הייתה פגישת הערכה? לכן הקישי 1, ללא הקישי 9'],
    ['validationConfirmOfekReport', 'אופק: אישור דיווח. {0} שם, {1} שיעורים, {2} דיונים, {3} פגישה', 'דיווחת על המורה {0}: {1} שיעורים, {2} שיעורי דיון, פגישת הערכה: {3}. לאישור הקישי 1, לתיקון הקישי 2'],
];

exports.up = async function (knex) {
    for (const [name, add] of columns) {
        if (!(await knex.schema.hasColumn('att_reports', name))) {
            await knex.schema.alterTable('att_reports', add);
        }
    }

    const userIds = (await knex('texts').distinct('user_id')).map(row => row.user_id);
    for (const user_id of userIds) {
        const existing = new Set((await knex('texts').where({ user_id }).select('name')).map(row => row.name));
        const rows = texts
            .filter(([name]) => !existing.has(name))
            .map(([name, description, value]) => ({ user_id, name, description, value }));
        if (rows.length) {
            await knex('texts').insert(rows);
        }
    }
};

exports.down = async function (knex) {
    await knex('texts').whereIn('name', texts.map(([name]) => name)).del();
    for (const [name] of columns) {
        if (await knex.schema.hasColumn('att_reports', name)) {
            await knex.schema.alterTable('att_reports', table => table.dropColumn(name));
        }
    }
};
