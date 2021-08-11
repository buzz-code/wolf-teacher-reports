import { CallBase } from "../../common-modules/server/utils/callBase";
import format from 'string-format';
import * as queryHelper from './queryHelper';
// import AttReport from "../models/att-report.model";

export class YemotCall extends CallBase {
    constructor(params, callId, user) {
        super(params, callId, user);
    }

    texts = {
        phoneIsNotRecognizedInTheSystem: 'מספר הטלפון אינו רשום במערכת',
        welcomeForTeacher: 'שלום המורה {0} הגעת לתיקופון',
        teacherTypeIsNotRecognizedInTheSystem: 'סוג המורה לא מוכר במערכת, אנא פני למזכירה',
        existingReportWillBeDeleted: 'שימי לב, קיים כבר דיווח היום, במידה ותבחרי להמשיך הוא יימחק',
        howManyWatchedLessonWereToday: 'בכמה שיעורים צפו תלמידות?',
        howManyTeachedByStudentLessonWereToday: 'בכמה שיעורים מסרו תלמידות?',
        howManyMethodicLessonWereToday: 'כמה שיעורים מתודיקה או דיון היו היום?',
        whatTypeOfActivityWasToday: 'איזה סוג פעילות הייתה היום בבית הספר? לצפיה הקישי 1 למסירה הקישי 2',
        whatTypeOfStudentAttendance: 'תלמידה {0}, שיעור מספר {1}, מה היה? צפיה או פרטני הקישי 1, מסירה או מעורבות הקישי 2, דיון הקישי 3, התלמידה חסרה מסיבות אישיות הקישי 4, לתלמידה הבאה הקישי 5',
        dataWasNotSaved: 'ארעה שגיאה, נסי שוב במועד מאוחר יותר',
        dataWasSavedSuccessfully: 'התיקוף הסתיים בהצלחה',
    }

    async start() {
        // await this.getTexts();
        try {
            const teacher = await queryHelper.getTeacherByUserIdAndPhone(this.user.id, this.params.ApiPhone);
            if (!teacher) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }

            // const existing_report = await queryHelper.getReportByTeacherIdAndToday(this.user.id, teacher.id);
            // if (existing_report) {
            //     await this.send(
            //         this.id_list_message({ type: 'text', text: this.texts.existingReportWillBeDeleted })
            //     );
            // }

            await this.send(
                this.id_list_message({ type: 'text', text: format(this.texts.welcomeForTeacher,teacher.name) })
            );

            switch (teacher.teacher_type_id) {
                case 1:
                    await getSeminarKitaReport(teacher);
                    break;
                case 2:
                    await getTrainingReport(teacher);
                    break;
                case 3:
                    await getManhaReport(teacher);
                    break;
                case 4:
                    await getReponsibleReport(teacher);
                    break;
                default:
                    await this.send(
                        this.id_list_message({ type: 'text', text: this.texts.teacherTypeIsNotRecognizedInTheSystem }),
                        this.hangup()
                    );
                    break;
            }

            // todo: save report
            // todo: delete existing_report

            // try {
            //     const attReport = {
            //         user_id: this.user.id,
            //         teacher_id: teacher.id,
            //         lesson_id: lesson.id,
            //         enter_time: new Date(),
            //     };
            //     await new AttReport(attReport).save();
            //     await this.send(
            //         this.id_list_message({ type: 'text', text: this.texts.dataWasSavedSuccessfully }),
            //         this.hangup()
            //     );
            // }
            // catch (e) {
            //     console.log('catch yemot exception', e);
            //     await this.send(
            //         this.id_list_message({ type: 'text', text: this.texts.dataWasNotSaved }),
            //         this.hangup()
            //     );
            // }
        }
        catch (e) {
            if (e) {
                console.log('catch yemot exception', e);
            }
        } finally {
            this.end();
        }
    }

    async getSeminarKitaReport(teacher) {
        await askForStudentAttendance(teacher.student1);
        await askForStudentAttendance(teacher.student2);
        await askForStudentAttendance(teacher.student3);
    }

    async getTrainingReport(teacher) {
        await this.send(
            this.read({ type: 'text', text: this.texts.howManyWatchedLessonWereToday },
                'howManyWatcheds', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.howManyTeachedByStudentLessonWereToday },
                'howManyTeachedByStudent', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getManhaReport(teacher) {
        await this.send(
            this.read({ type: 'text', text: this.texts.howManyMethodicLessonWereToday },
                'howManyMethodic', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getReponsibleReport(teacher) {
        await this.send(
            this.read({ type: 'text', text: this.texts.whatTypeOfActivityWasToday },
                'activityType', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async askForStudentAttendance(student) {
        if (!student) {
            return;
        }
        const studentReports = [];
        for (var i = 1; i <= 5; i++) {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.whatTypeOfStudentAttendance, student.name, i) },
                    'studentAttendance' + i, 'tap', { max: 1, min: 1, block_asterisk: true })
            );

            if (this.params['studentAttendance' + i] == 5) {
                break;
            }

            studentReports.push({
                ['studentAttendance' + i]: this.params['studentAttendance' + i],
            })
        }
        this.params[student.id] = studentReports;
    }
}