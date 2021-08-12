import bookshelf from '../../common-modules/server/config/bookshelf';

const student_columns = [
    'student_1_1_att_type',
    'student_1_2_att_type',
    'student_1_3_att_type',
    'student_1_4_att_type',
    'student_1_5_att_type',
    'student_2_1_att_type',
    'student_2_2_att_type',
    'student_2_3_att_type',
    'student_2_4_att_type',
    'student_2_5_att_type',
    'student_3_1_att_type',
    'student_3_2_att_type',
    'student_3_3_att_type',
    'student_3_4_att_type',
    'student_3_5_att_type',
]

export function getSeminarKitaSelector(lessonType) {
    return bookshelf.knex.raw(
        '(' + student_columns.map(item => 'COALESCE(' + item + ', 0) = ' + lessonType).join(') + (') + ')'
    );
}