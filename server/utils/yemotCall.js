import { CallBase } from "./callBase";
import format from 'string-format';

// todo: replace mock
const Student = { findByPhone: async (phone) => ({ Name: 'שושנה' }) }
const Report = { createReport: async (params) => true }
const Teacher = { findByTz: async (id) => ({ Name: 'ברכה' }) }
const ReportType = { fetchAll: async () => ([{ Name: 'צפיה' }, { Name: 'מסירה' }]) }

export class YemotCall extends CallBase {
    constructor(callId) {
        super(callId);
    }

    texts = {
        phoneIsNotRecognizedInTheSystem: 'מספר הטלפון אינו רשום במערכת',
        welcomeAndTypeEnterHour: 'שלום {0} הגעת למוקד תיקוף נוכחות בצפיה, נא הקישי את שעת הכניסה שלך בארבע ספרות',
        typeExitHour: 'נא הקישי את שעת היציאה שלך בארבע ספרות',
        // hourIsNotValidAndTryAgain: 'השעה שהוזנה אינה תקינה, נסי שנית',
        typeTzOfTeacher: 'נא הקישי את מספר הזיהוי של המורה המאמנת',
        teacherTzIsNotInTheSystem: 'מספר הזיהוי לא קיים במערכת, להשלמת התיקוף צרי קשר עם המורה המנחה',
        askForNumberOfLessons: 'כמה שיעורים צפית אצל המורה {0}?',
        lessonNumber: 'שיעור {0}:',
        askForOtherStudentsNumber: 'כמה בנות צפו בשיעור חוץ ממך?',
        chooseAttendanceTypeByLesson: 'בחרי את סוג הנוכחות, ',
        forAttendanceTypeXPressY: 'ל{0} הקישי {1}, ',
        askIfHasAnotherTeacher: 'האם צפית היום אצל מורה נוספת? לאישור הקישי 1, לסיום הקישי 2',
        recordWasNotSaved: 'ארעה שגיאה, נסי שוב במועד מאוחר יותר',
        recordWasSavedSuccessfully: 'תיקוף השיחה הסתיים בהצלחה',
    }

    async start() {
        try {
            const student = await Student.findByPhone(this.params.ApiPhone);
            if (!student) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }
            await this.send(
                this.read({ type: 'text', text: format(this.texts.welcomeAndTypeEnterHour, student.Name) },
                    'enterHour', 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            await this.send(
                this.read({ type: 'text', text: this.texts.typeExitHour },
                    'exitHour', 'tap', { max: 4, min: 4, block_asterisk: true })
            );
            await this.getTeacherDetails();
            const isSuccess = await Report.createReport(this.params);
            if (isSuccess) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.recordWasSavedSuccessfully }),
                    this.hangup()
                );
            } else {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.recordWasNotSaved }),
                    this.hangup()
                );
            }
        }
        catch (e) {
            if (e) {
                console.log('catch yemot exeption', e);
            }
        } finally {
            this.end();
        }
    }

    async getTeacherDetails() {
        await this.send(
            this.read({ type: 'text', text: this.texts.typeTzOfTeacher },
                'teacherId', 'tap', { max: 9, min: 9, block_asterisk: true })
        );

        const teacher = await Teacher.findByTz(this.params.teacherId);
        if (teacher) {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.askForNumberOfLessons, teacher.Name) },
                    'lessonNumber', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        } else {
            await this.send(
                this.id_list_message({ typs: 'text', text: this.texts.teacherTzIsNotInTheSystem }),
                this.read({ type: 'text', text: format(this.texts.askForNumberOfLessons, '') },
                    'lessonNumber', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        }
        const lessonNumber = Number(this.params.lessonNumber);
        const lessons = [];
        const types = await ReportType.fetchAll();
        let reportTypeMessage = this.texts.chooseAttendanceTypeByLesson;
        for (const index in types) {
            reportTypeMessage += format(this.texts.forAttendanceTypeXPressY, types[index].Name, index + 1)
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
            lessons.push({ otherStudents, reportType });
        }

        if (!this.params.teacherReport) {
            this.params.teacherReport = [];
        }
        this.params.teacherReport.push({ teacherId: this.params.teacherId, lessons });

        await this.send(
            this.read({ type: 'text', text: this.texts.askIfHasAnotherTeacher },
                'anotherTeacher', 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2] })
        );
        if (this.params.anotherTeacher === '1') {
            await this.getTeacherDetails();
        }
    }
}