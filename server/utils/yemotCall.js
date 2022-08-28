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

    async start() {
        await this.getTexts();
        try {
            this.teacher = await queryHelper.getTeacherByUserIdAndPhone(this.user.id, this.params.ApiPhone);
            if (!this.teacher) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.phoneIsNotRecognizedInTheSystem }),
                    this.hangup()
                );
            }

            await this.getReportDate();

            const messages = [];
            this.existingReport = await queryHelper.getReportByTeacherIdAndToday(this.user.id, this.teacher.id, this.report_date);
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

            await this.getReportAndSave(messages);
        }
        catch (e) {
            if (e) {
                console.log('catch yemot exception', e);
            }
        } finally {
            this.end();
        }
    }

    async getReportDate() {
        await this.send(
            this.id_list_message({ type: 'text', text: format(this.texts.welcomeForTeacher, this.teacher.name) }),
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
    }

    async getReportAndSave(messages) {
        switch (this.teacher.teacher_type_id) {
            case 1:
                await this.getSeminarKitaReport(messages);
                break;
            case 2:
                await this.getTrainingReport(messages);
                break;
            case 3:
                await this.getManhaReport(messages);
                break;
            case 4:
                await this.getReponsibleReport(messages);
                break;
            case 5:
                await this.getPdsReport(messages);
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
                teacher_id: this.teacher.id,
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

    async getSeminarKitaReport(messages) {
        const students = [];
        if (this.teacher.student1) {
            students.push({ num: '1', student: this.teacher.student1 });
        }
        if (this.teacher.student2) {
            students.push({ num: '2', student: this.teacher.student2 });
        }
        if (this.teacher.student3) {
            students.push({ num: '3', student: this.teacher.student3 });
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

    async getTrainingReport(messages) {
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

    async getManhaReport(messages) {
        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.howManyMethodicLessonWereToday },
                'howManyMethodic', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getReponsibleReport(messages) {
        await this.send(
            messages.length && this.id_list_message({ type: 'text', text: messages }),
            this.read({ type: 'text', text: this.texts.whatTypeOfActivityWasToday },
                'activityType', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getPdsReport(messages) {
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
        if (this.texts.didYouAttendFirstConference) {
            await this.send(
                messages.length && this.id_list_message({ type: 'text', text: messages }),
                this.read({ type: 'text', text: this.texts.didYouAttendFirstConference },
                    'firstConference', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            messages.length = 0;
        }
        if (this.texts.didYouAttendSecondConference) {
            await this.send(
                messages.length && this.id_list_message({ type: 'text', text: messages }),
                this.read({ type: 'text', text: this.texts.didYouAttendSecondConference },
                    'secondConference', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            messages.length = 0;
        }
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