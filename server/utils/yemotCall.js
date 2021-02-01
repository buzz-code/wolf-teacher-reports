import { CallBase } from "./callBase";
import format from 'string-format';
import * as queryHelper from './queryHelper';
import Report from "../models/report.model";

export class YemotCall extends CallBase {
    constructor(params, callId, user) {
        super(params, callId, user);
    }

    // texts = {
    //     phoneIsNotRecognizedInTheSystem: 'מספר הטלפון אינו רשום במערכת',
    //     welcomeAndTypeEnterHour: 'שלום {0} הגעת למוקד תיקוף נוכחות בצפיה, נא הקישי את שעת הכניסה שלך בארבע ספרות',
    //     typeExitHour: 'נא הקישי את שעת היציאה שלך בארבע ספרות',
    //     typeTzOfTeacher: 'נא הקישי את מספר הזיהוי של המורה המאמנת',
    //     teacherTzIsNotInTheSystem: 'מספר הזיהוי לא קיים במערכת, להשלמת התיקוף צרי קשר עם המורה המנחה',
    //     askForNumberOfLessons: 'כמה שיעורים צפית אצל המורה {0}?',
    //     lessonNumber: 'שיעור {0}:',
    //     askForOtherStudentsNumber: 'כמה בנות צפו בשיעור חוץ ממך?',
    //     chooseAttendanceTypeByLesson: 'בחרי את סוג הנוכחות, ',
    //     forAttendanceTypeXPressY: 'ל{0} הקישי {1}, ',
    //     askIfHasAnotherTeacher: 'האם צפית היום אצל מורה נוספת? אם כן הקישי 1, אם לא הקישי 2',
    //     recordWasNotSaved: 'ארעה שגיאה, נסי שוב במועד מאוחר יותר',
    //     recordWasSavedSuccessfully: 'תיקוף הנוכחות הסתיים בהצלחה',
    // }

    async start() {
        await this.getTexts();
        try {
            const student = await queryHelper.getStudentByUserIdAndPhone(this.user.id, this.params.ApiPhone);
            if (!student) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }
            await this.send(
                this.read({ type: 'text', text: format(this.texts.welcomeAndTypeEnterHour, student.name) },
                    'enterHour', 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            await this.send(
                this.read({ type: 'text', text: this.texts.typeExitHour },
                    'exitHour', 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            await this.getTeacherDetails();
            try {
                const baseReport = {
                    user_id: this.user.id,
                    student_id: student.id,
                    enter_hour: this.params.enterHour,
                    exit_hour: this.params.exitHour,
                    report_date: new Date().toISOString().substr(0, 10),
                };
                let lessonIndex = 1;
                for (const teacherReport of this.params.teacherReport) {
                    const baseTeacherReport = {
                        ...baseReport,
                        teacher_id: teacherReport.teacher?.id,
                        teacher_tz: teacherReport.teacherTz,
                    };
                    for (const lesson of teacherReport.lessons) {
                        await new Report({
                            ...baseTeacherReport,
                            lesson_number: lessonIndex++,
                            other_students: lesson.otherStudents,
                            report_type_id: lesson.reportType.id,
                        })
                            .save();
                    }
                }
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.recordWasSavedSuccessfully }),
                    this.hangup()
                );
            }
            catch (e) {
                console.log('catch yemot exception', e);
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.recordWasNotSaved }),
                    this.hangup()
                );
            }
        }
        catch (e) {
            if (e) {
                console.log('catch yemot exception', e);
            }
        } finally {
            this.end();
        }
    }

    async getTeacherDetails() {
        await this.send(
            this.read({ type: 'text', text: this.texts.typeTzOfTeacher },
                'teacherTz', 'tap', { max: 9, min: 9, block_asterisk: true })
        );

        const teacher = await queryHelper.getTeacherByUserIdAndTz(this.user.id, this.params.teacherTz);
        if (teacher) {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.askForNumberOfLessons, teacher.name) },
                    'lessonNumber', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        } else {
            await this.send(
                this.id_list_message({ type: 'text', text: this.texts.teacherTzIsNotInTheSystem }),
                this.read({ type: 'text', text: format(this.texts.askForNumberOfLessons, '') },
                    'lessonNumber', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        }
        const lessonNumber = Number(this.params.lessonNumber);
        const lessons = [];
        const types = await queryHelper.getReportTypeByUserId(this.user.id);
        let reportTypeMessage = this.texts.chooseAttendanceTypeByLesson;
        for (const index in types) {
            reportTypeMessage += format(this.texts.forAttendanceTypeXPressY, types[index].name, (Number(index) + 1))
        }

        for (let i = 0; i < lessonNumber; i++) {
            await this.send(
                this.id_list_message({ type: 'text', text: format(this.texts.lessonNumber, i + 1) }),
                this.read({ type: 'text', text: this.texts.askForOtherStudentsNumber },
                    'otherStudents', 'tap', { max: 2, min: 1, block_asterisk: true })
            );
            const otherStudents = Number(this.params.otherStudents);
            await this.send(
                this.read({ type: 'text', text: reportTypeMessage },
                    'reportType', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            const reportType = Number(this.params.reportType);
            lessons.push({ otherStudents, reportType: types[reportType - 1] });
        }

        if (!this.params.teacherReport) {
            this.params.teacherReport = [];
        }
        this.params.teacherReport.push({ teacherTz: this.params.teacherTz, teacher, lessons });

        await this.send(
            this.read({ type: 'text', text: this.texts.askIfHasAnotherTeacher },
                'anotherTeacher', 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );
        if (this.params.anotherTeacher === '1') {
            await this.getTeacherDetails();
        }
    }
}