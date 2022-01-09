import { CallBase } from "../../common-modules/server/utils/callBase";
import format from 'string-format';
import moment from "moment";
import * as queryHelper from './queryHelper';
import AttReport from "../models/att-report.model";
import { lessonsCount, studentsCount } from "./constantsHelper";

export class YemotCall extends CallBase {
    constructor(params, callId, user) {
        super(params, callId, user);
    }

    // texts = {
    //     phoneIsNotRecognizedInTheSystem: 'מספר הטלפון אינו רשום במערכת',
    //     welcomeForTeacher: 'שלום המורה {0} הגעת לתיקופון',
    //     teacherTypeIsNotRecognizedInTheSystem: 'סוג המורה לא מוכר במערכת, אנא פני למזכירה',
    //     existingReportWillBeDeleted: 'שימי לב, קיים כבר דיווח היום, במידה ותבחרי להמשיך הוא יימחק',
    //     howManyWatchedLessonWereToday: 'בכמה שיעורים צפו תלמידות?',
    //     howManyTeachedByStudentLessonWereToday: 'בכמה שיעורים מסרו תלמידות?',
    //     howManyMethodicLessonWereToday: 'כמה שיעורים מתודיקה או דיון היו היום?',
    //     whatTypeOfActivityWasToday: 'איזה סוג פעילות הייתה היום בבית הספר? לצפיה הקישי 1 למסירה הקישי 2',
    //     teacherHasNotStudents: 'אין לך תלמידות מקושרות, אנא פני למזכירה',
    //     whatTypeOfStudentAttendance: 'תלמידה {0}, שיעור מספר {1}, מה היה?, צפיה או פרטני הקישי 1, מסירה או מעורבות הקישי 2, דיון הקישי 3, התלמידה חסרה מסיבות אישיות הקישי 4, לתלמידה הבאה הקישי 5',
    //     dataWasNotSaved: 'ארעה שגיאה, נסי שוב במועד מאוחר יותר',
    //     dataWasSavedSuccessfully: 'התיקוף הסתיים בהצלחה',
    // }

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

            await this.send(
                this.id_list_message({ type: 'text', text: format(this.texts.welcomeForTeacher, teacher.name) }),
                this.read({ type: 'text', text: this.texts.chooseReportDateType },
                    'reportDateType', 'tap', { max: 1, min: 1, block_asterisk: true })
            );

            if (this.params.reportDateType === '1') {
                this.report_date = moment().format('YYYY-MM-DD');
            } else if (this.params.reportDateType === '2') {
                await this.send(
                    this.read({ type: 'text', text: this.texts.chooseReportDate },
                        'reportDate', 'tap', { max: 8, min: 8, block_asterisk: true })
                );
                this.report_date = moment(this.params.reportDate, 'DDMMYYYY').format('YYYY-MM-DD');
            } else {
                await this.send(
                    this.hangup()
                );
            }

            const messages = [];
            this.existingReport = await queryHelper.getReportByTeacherIdAndToday(this.user.id, teacher.id, this.report_date);
            if (this.existingReport) {
                if (moment(this.report_date, 'YYYY-MM-DD').isBefore(moment().startOf('month'))) {
                    await this.send(
                        this.id_list_message({ type: 'text', text: this.texts.cannotChangeReportOfPreviousMonth }),
                        this.hangup()
                    );
                } else {
                    messages.push(this.texts.existingReportWillBeDeleted);
                }
            }

            await this.getReportAndSave(teacher, messages);
        }
        catch (e) {
            if (e) {
                console.log('catch yemot exception', e);
            }
        } finally {
            this.end();
        }
    }

    async getReportAndSave(teacher, messages) {
        switch (teacher.teacher_type_id) {
            case 1:
                await this.getSeminarKitaReport(teacher, messages);
                break;
            case 2:
                await this.getTrainingReport(teacher, messages);
                break;
            case 3:
                await this.getManhaReport(teacher, messages);
                break;
            case 4:
                await this.getReponsibleReport(teacher, messages);
                break;
            case 5:
                await this.getPdsReport(teacher, messages);
                break;
            default:
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.teacherTypeIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
                break;
        }

        try {
            const attReport = {
                user_id: this.user.id,
                teacher_id: teacher.id,
                report_date: this.report_date,
                update_date: new Date(),
                first_conference: this.params.firstConference,
                second_conference: this.params.secondConference,
                how_many_methodic: this.params.howManyMethodic,
                how_many_watched: this.params.howManyWatched,
                how_many_student_teached: this.params.howManyTeachedByStudent,
                was_discussing: this.params.wasDiscussing == '1',
                how_many_private_lessons: this.params.howManyPrivateLessons,
                training_teacher: this.params.whoTrainingTeacher,
                activity_type: this.params.activityType,
                ...this.getAllStudentAtt(),
            };
            await new AttReport(attReport).save();
            if (this.existingReport) {
                await new AttReport().where({ id: this.existingReport.id }).destroy();
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

    async getSeminarKitaReport(teacher, messages) {
        const students = [];
        if (teacher.student1) {
            students.push({ num: '1', student: teacher.student1 });
        }
        if (teacher.student2) {
            students.push({ num: '2', student: teacher.student2 });
        }
        if (teacher.student3) {
            students.push({ num: '3', student: teacher.student3 });
        }


        if (!students.length) {
            await this.send(
                messages.length && this.id_list_message({ type: 'text', text: messages }),
                this.id_list_message({ type: 'text', text: this.texts.teacherHasNotStudents }),
                this.hangup()
            );
        }

        await this.askForConferenceAttendance(messages);

        this.params.studentsAtt = [];
        for (const student of students) {
            await this.askForStudentAttendance(student, messages);
        }
    }

    async getTrainingReport(teacher, messages) {
        await this.send(
            this.read({ type: 'text', text: this.texts.whoIsYourTrainingTeacher },
                'whoTrainingTeacher', 'voice', { record_engine: true })
        );
        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.howManyWatchedLessonWereToday },
                'howManyWatched', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.howManyTeachedByStudentLessonWereToday },
                'howManyTeachedByStudent', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.haveYouMadeADiscussing },
                'wasDiscussing', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.howManyPrivateLessonsWereToday },
                'howManyPrivateLessons', 'tap', { max: 2, min: 1, block_asterisk: true })
        );
    }

    async getManhaReport(teacher, messages) {
        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.howManyMethodicLessonWereToday },
                'howManyMethodic', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getReponsibleReport(teacher, messages) {
        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.whatTypeOfActivityWasToday },
                'activityType', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getPdsReport(teacher, messages) {
        await this.askForConferenceAttendance(messages);

        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.howManyWatchedLessonWereTodayPds },
                'howManyWatched', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.howManyTeachedByStudentLessonWereTodayPds },
                'howManyTeachedByStudent', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        await this.send(
            this.read({ type: 'text', text: this.texts.haveYouMadeADiscussingPds },
                'wasDiscussing', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async askForStudentAttendance({ num, student }, messages) {
        const studentReports = [];
        for (var i = 1; i <= lessonsCount; i++) {
            await this.send(
                messages.length && this.id_list_message({ type: 'text', text: messages }),
                this.read({ type: 'text', text: format(this.texts.whatTypeOfStudentAttendance, student.name, i) },
                    'studentAttendance', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            messages.length = 0;

            if (this.params.studentAttendance == 5) {
                break;
            }

            studentReports.push(this.params.studentAttendance);
        }
        this.params.studentsAtt[num] = studentReports;
    }

    async askForConferenceAttendance(messages) {
        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.didYouAttendFirstConference },
                'firstConference', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        messages.length = 0;
        await this.send(
            this.read({ type: 'text', text: this.texts.didYouAttendSecondConference },
                'secondConference', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    getAllStudentAtt() {
        return Object.fromEntries(
            new Array(studentsCount).fill(0)
                .flatMap((a, studentIndex) => new Array(lessonsCount).fill(0)
                    .map((b, lessonIndex) => ([
                        `student_${studentIndex + 1}_${lessonIndex + 1}_att_type`,
                        this.getStudentAtt(studentIndex + 1, lessonIndex)
                    ])))
        );
    }

    getStudentAtt(studentNum, lessonIndex) {
        if (!this.params.studentsAtt)
            return undefined;
        if (!this.params.studentsAtt[studentNum])
            return undefined
        return this.params.studentsAtt[studentNum][lessonIndex];
    }
}