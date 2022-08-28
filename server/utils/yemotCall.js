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

            await this.validateExistingReports();

            await this.getReportAndSave();
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

    async validateExistingReports() {
        this.existingReport = await queryHelper.getReportByTeacherIdAndToday(this.user.id, this.teacher.id, this.report_date);
        if (this.existingReport) {
            if (moment(this.report_date, 'YYYY-MM-DD').isBefore(moment().startOf('month'))) {
                await this.send(
                    this.id_list_message({ type: 'text', text: this.texts.cannotChangeReportOfPreviousMonth }),
                    this.hangup()
                );
            } else {
                this.warningMsg = this.texts.existingReportWillBeDeleted;
            }
        }
    }

    async getReportAndSave() {
        switch (this.teacher.teacher_type_id) {
            case 1:
                //מורה של סמינר כיתה
                await this.getSeminarKitaReport();
                break;
            case 2:
                //מורה מאמנת - לא בשימוש
                await this.getTrainingReport();
                break;
            case 3:
                //מורה מנחה
                await this.getManhaReport();
                break;
            case 4:
                //אחראית בית ספר - לא בשימוש
                await this.getReponsibleReport();
                break;
            case 5:
                //מורת פידיאס
                await this.getPdsReport();
                break;
            case 6:
                //גננות
                await this.getKindergartenReport();
                break;
            case 7:
                //חינוך מיוחד
                await this.getSpecialEducationReport();
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
                how_many_methodic: this.params.howManyMethodic,
                how_many_lessons_absence: this.params.howManyLessonsAbsence,
                how_many_watched_lessons: this.params.howManyWatchedLessons,
                was_discussing: this.params.wasDiscussing == '1',
                how_many_teached: this.params.howManyTeached,
                how_many_individual: this.params.howManyIndividual,
                was_kamal: this.params.wasKamal,
                how_many_interfering: this.params.howManyInterfering,
                how_many_students: this.params.howManyStudents,
                was_students_good: this.params.wasStudentsGood,
                was_students_enter_on_time: this.params.wasStudentsEnterOnTime,
                was_students_exit_on_time: this.params.wasStudentsExitOnTime,
                how_many_lessons: this.params.howManyLessons,
                how_many_students_watched: this.params.howManyStudentsWatched,
                how_many_students_teached: this.params.howManyStudentsTeached,
                was_phone_discussing: this.params.wasPhoneDiscussing,
                your_training_teacher: this.params.whoIsYourTrainingTeacher,
                what_speciality: this.params.whatIsYourSpeciality,
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

    warningMsgIfExists() {
        const message = this.warningMsg && this.id_list_message({ type: 'text', text: this.warningMsg });
        this.warningMsg = null;
        return message;
    }

    async getSeminarKitaReport() {
        //אותו דבר כמו סמינר כיתה
        await this.getPdsReport();
    }

    async getTrainingReport() {
        //לא בשימוש
    }

    async getManhaReport() {
        //האם מדווחת על עצמה או על מורות אחרות?
        await this.send(
            warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askManhaReportType },
                'manhaReportType', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        if (this.params.manhaReportType == 1) {
            //מדווחת על עצמה
            //כמה שיעורי מתודיקה היו?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyMethodic },
                    'howManyMethodic', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        } else {
            //מדווחת על מורות אחרות
            //TODO
            //הקישי 4 ספרות אחרונות של הטלפון של המורה
            //האם תעריף חוליה או תעריף כיתתי?
            //כמה שיעורי צפיה?
            //כמה בנות מסרו היום שיעור?
            //אם התשובה גדולה מ0 אז  
            //הקישי את מ.ז. של התלמידה-  וחוזר על עצמו כמספר התלמידות שהמורה הקלידה שמסרו.
            //כמה שיעורי ילקוט הרועים?
            //כמה שיעורי דיון?
            //ובסיום האם תרצי לדווח על מורה נוספת        
        }
    }

    async getReponsibleReport() {
        //לא בשימוש
    }

    async getPdsReport() {
        //האם התלמידות חסרו?
        await this.send(
            warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askWasStudentAbsence },
                'wasStudentAbsence', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        if (this.params.wasStudentAbsence == 1) {
            //כמה שיעורים חסרו?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyLessonsAbsence },
                    'howManyLessonsAbsence', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
        }
        //כמה שיעורי צפיה היו?
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyWatchedLessons },
                'howManyWatchedLessons', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם היה דיון?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasDiscussing },
                'wasDiscussing', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה שיעורי מסירה?
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyTeached },
                'howManyTeached', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה שיעורי פרטני?
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyIndividual },
                'howManyIndividual', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם היה קמל?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasKamal },
                'wasKamal', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה שיעורי התערבות?
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyInterfering },
                'howManyInterfering', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getKindergartenReport() {
        //כמה בנות היו בצפיה בגן?
        await this.send(
            warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askHowManyStudents },
                'howManyStudents', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם היה דיון?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasDiscussing },
                'wasDiscussing', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם תפקוד הבנות ענה על ציפיותיך?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasStudentsGood },
                'wasStudentsGood', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם התלמידות היו בגן בזמן?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasStudentsEnterOnTime },
                'wasStudentsEnterOnTime', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם התלמידות יצאו בזמן?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasStudentsExitOnTime },
                'wasStudentsExitOnTime', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }

    async getSpecialEducationReport() {
        //כמה שיעורים היו?
        await this.send(
            warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askHowManyLessons },
                'howManyLessons', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה תלמידות צפו?
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyStudentsWatched },
                'howManyStudentsWatched', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //כמה תלמידות מסרו?
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyStudentsTeached },
                'howManyStudentsTeached', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //האם היה דיון טלפוני?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWasPhoneDiscussing },
                'wasPhoneDiscussing', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //מי המורה המנחה שלך?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWhoIsYourTrainingTeacher },
                'whoIsYourTrainingTeacher', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        //מה ההתמחות?
        await this.send(
            this.read({ type: 'text', text: this.texts.askWhatIsYourSpeciality },
                'whatIsYourSpeciality', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
    }
}