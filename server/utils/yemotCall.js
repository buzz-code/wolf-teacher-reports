import { CallBase } from "./callBase";
import format from 'string-format';
import * as queryHelper from './queryHelper';
import AttReport from "../models/att-report.model";

export class YemotCall extends CallBase {
    constructor(params, callId, user) {
        super(params, callId, user);
    }

    texts = {
        phoneIsNotRecognizedInTheSystem: 'מספר הטלפון אינו רשום במערכת',
        welcomeAndTypeKlassId: 'שלום {0} הגעת למוקד רישום הנוכחות, נא הקישי את קוד הכיתה',
        confirmKlass: 'כיתה {0}, לאישור הקישי 1, לתיקון הקישי 2',
        klassIdNotFound: 'קוד כיתה לא נמצא',
        typeLessonId: 'נא הקישי את קוד השיעור',
        confirmLesson: 'שיעור {0}, לאישור הקישי 1, לתיקון הקישי 2',
        lessonIdNotFound: 'קוד שיעור לא נמצא',
        startStudentList: 'כעת תושמע רשימת התלמידות',
        prevStudent: 'מעבר לתלמידה הקודמת',
        forAttendanceTypeXPressY: 'ל{0} הקישי {1}, ',
        dataWasNotSaved: 'ארעה שגיאה, נסי שוב במועד מאוחר יותר',
        dataWasSavedSuccessfully: 'רישום הנוכחות הסתיים בהצלחה',
    }

    async start() {
        await this.getTexts();
        try {
            const teacher = await queryHelper.getTeacherByUserIdAndPhone(this.user.id, this.params.ApiPhone);
            if (!teacher) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }
            const klass = await this.getKlass();
            const lesson = await this.getLesson();
            await this.getStudentReports(klass);
            try {
                const baseReport = {
                    user_id: this.user.id,
                    teacher_id: teacher.id,
                    lesson_id: lesson.id,
                    lesson_time_id: 1, //TBD
                    enter_time: new Date(),
                };
                for (const studentId in this.params.studentReports) {
                    const attReport = {
                        ...baseReport,
                        student_id: studentId,
                        att_type_id: this.params.studentReports[studentId],
                    };
                    await new AttReport(attReport).save();
                }
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.dataWasSavedSuccessfully }),
                    this.hangup()
                );
            }
            catch (e) {
                console.log('catch yemot exception', e);
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.dataWasNotSaved }),
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

    async getKlass() {
        await this.send(
            this.read({ type: 'text', text: format(this.texts.welcomeAndTypeKlassId, teacher.name) },
                'klassId', 'tap', { max: 4, min: 1, block_asterisk: true })
        );
        let klass = await queryHelper.getKlassByUserIdAndKlassId(this.user.id, this.params.klassId);
        if (klass) {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.confirmKlass, klass.name) },
                    'klassConfirm', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            if (this.params.klassConfirm === '2') {
                return this.getKlass();
            }
        } else {
            await this.send(this.id_list_message({ type: 'text', text: this.texts.klassIdNotFound }));
            return this.getKlass();
        }
        return klass;
    }

    async getLesson() {
        await this.send(
            this.read({ type: 'text', text: this.texts.typeLessonId },
                'lessonId', 'tap', { max: 4, min: 1, block_asterisk: true })
        );
        let lesson = await queryHelper.getLessonByUserIdAndLessonId(this.user.id, this.params.lessonId);
        if (lesson) {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.confirmLesson, lesson.name) },
                    'lessonConfirm', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            if (this.params.lessonConfirm === '2') {
                return this.getLesson();
            }
        } else {
            await this.send(this.id_list_message({ type: 'text', text: this.texts.lessonIdNotFound }));
            return this.getLesson();
        }
        return lesson;
    }

    async getStudentReports(klass) {
        await this.send(this.id_list_message({ type: 'text', text: this.texts.startStudentList }));

        const students = await queryHelper.getStudentsByUserIdAndKlassId(this.user.id, klass.id);
        const types = await queryHelper.getAttTypesByUserId(this.user.id);
        types.push({ name: this.texts.prevStudent })
        const attTypeMessage = types.map((item, index) => format(this.texts.forAttendanceTypeXPressY, item.name, (Number(index) + 1))).join('');

        this.params.studentReports = {};
        for (let index = 0; index < students.length; index++) {
            const student = students[index];
            await this.send(
                this.id_list_message({ type: 'text', text: student.name + ', ' }),
                this.read({ type: 'text', text: attTypeMessage },
                    'attType', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            const attType = Number(this.params.attType);
            if (attType === types.length) {
                index -= 2;
            } else {
                this.params.studentReports[student.id] = types[attType - 1].id;
            }
        }
    }
}