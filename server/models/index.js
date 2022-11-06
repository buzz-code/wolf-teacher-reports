import bookshelf from "../../common-modules/server/config/bookshelf";

function createModel(table, properties = {}) {
    return bookshelf.model(table, {
        tableName: table,
        ...properties
    })
}
export const User = createModel('users', {
    verifyPassword(password) {
        return this.get('password') === password;
    }
})

export const Answer = createModel('answers', {
    user() {
        return this.belongsTo(User);
    }
})

export const AttReport = createModel('att_reports')

export const AttType = createModel('att_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const Price = createModel('prices', {
    user() {
        return this.belongsTo(User);
    }
})

export const QuestionType = createModel('question_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const Question = createModel('questions', {
    user() {
        return this.belongsTo(User);
    }
})

export const Student = createModel('students', {
    user() {
        return this.belongsTo(User);
    }
})

export const TeacherSalaryType = createModel('teacher_salary_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const TeacherType = createModel('teacher_types', {
    user() {
        return this.belongsTo(User);
    }
})

export const Teacher = createModel('teachers', {
    user() {
        return this.belongsTo(User);
    }
})

export const Text = createModel('texts', {
    user() {
        return this.belongsTo(User);
    }
})

export const WorkingDate = createModel('working_dates', {
    user() {
        return this.belongsTo(User);
    }
})
