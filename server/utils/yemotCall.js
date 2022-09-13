import { CallBase } from "../../common-modules/server/utils/callBase";
import format from 'string-format';
import moment from "moment";
import * as queryHelper from './queryHelper';
import AttReport from "../models/att-report.model";
import { formatJewishDateHebrew, getJewishDate } from "jewish-dates-core";

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

            await this.askQuestions();

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

    async askQuestions() {
        const questions = await queryHelper.getQuestionsForTeacher(this.user.id, this.teacher.id, this.teacher.teacher_type_id);
        for (const question of questions) {
            await this.send(
                this.id_list_message({ type: 'text', text: question.content }),
                this.read({ type: 'text', text: this.texts.chooseAnswerForQuestion },
                    'questionAnswer', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            await queryHelper.saveAnswerForQuestion(this.user.id, this.teacher.id, question.id, this.params.questionAnswer);
        }
    }

    async getReportDate() {
        await this.send(
            this.id_list_message({ type: 'text', text: format(this.texts.welcomeForTeacher, this.teacher.teacher_type_name, this.teacher.name) }),
            this.read({ type: 'text', text: this.texts.chooseReportDateType },
                'reportDateType', 'tap', { max: 1, min: 1, block_asterisk: true })
        );

        if (this.params.reportDateType === '1') {
            this.report_date = moment().format('YYYY-MM-DD');
        } else if (this.params.reportDateType === '2') {
            await this.getAndValidateReportDate();
        } else {
            await this.send(
                this.hangup()
            );
        }
    }

    async getAndValidateReportDate() {
        await this.send(
            this.warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.chooseReportDate },
                'reportDate', 'tap', { max: 8, min: 8, block_asterisk: true })
        );
        const reportDate = moment(this.params.reportDate, 'DDMMYYYY');

        //תאריך לא חוקי
        const reportDateIsValid = reportDate.isValid;
        if (reportDateIsValid === false) {
            this.warningMsg = this.texts.validationErrorReportDateIsInvalid;
            return this.getAndValidateReportDate();
        }

        //אי אפשר לדווח על חודש לועזי שעבר
        const reportDateIsPrevMonth = reportDate.isBefore(moment().startOf('month'));
        if (reportDateIsPrevMonth) {
            this.warningMsg = this.texts.validationErrorCannotReportOnPrevMonth;
            return this.getAndValidateReportDate();
        }

        //אי אפשר לדווח על העתיד
        const reportDateIsFuture = reportDate.isAfter(moment());
        if (reportDateIsFuture) {
            this.warningMsg = this.texts.validationErrorCannotReportOnFutureDate;
            return this.getAndValidateReportDate();
        }

        //יש טבלה של תאריכי עבודה לכל סוג מורה בנפרד, לוודא שהתאריך תואם
        const isWorkingDay = await queryHelper.validateWorkingDateForTeacher(this.user.id, this.teacher.teacher_type_id, reportDate.format('YYYY-MM-DD'));
        if (!isWorkingDay) {
            this.warningMsg = this.texts.validationErrorCannotReportOnNonWorkingDay;
            return this.getAndValidateReportDate();
        }

        //אזהרה אם כבר יש דיווח באותו תאריך
        this.existingReport = await queryHelper.getReportByTeacherIdAndToday(this.user.id, this.teacher.id, reportDate.format('YYYY-MM-DD'));
        if (this.existingReport) {
            this.warningMsg = this.texts.existingReportWillBeDeleted;
        }

        //בדיקת תאריך עברי
        const hebrewDate = formatJewishDateHebrew(getJewishDate(reportDate.toDate()))
        await this.send(
            this.read({ type: 'text', text: format(this.texts.askReportDateConfirm, hebrewDate) },
                'reportDateConfirm', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        if (this.params.reportDateConfirm == 2) {
            return this.getAndValidateReportDate();
        }

        this.report_date = reportDate.format('YYYY-MM-DD');
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
                four_last_digits_of_teacher_phone: this.params.fourLastDigitsOfTeacherPhone,
                is_taarif_hulia: this.params.isTaarifHulia,
                teached_student_tz: this.params.teachedStudentTz,
                how_many_yalkut_lessons: this.params.howManyYalkutLessons,
                how_many_discussing_lessons: this.params.howManyDiscussingLessons,
                how_many_lessons_absence: this.params.howManyLessonsAbsence,
                how_many_watched_lessons: this.params.howManyWatchedLessons,
                was_discussing: this.params.wasDiscussing == '1',
                how_many_teached: this.params.howManyTeached,
                how_many_individual: this.params.howManyIndividual,
                was_kamal: this.params.wasKamal,
                how_many_interfering: this.params.howManyInterfering,
                how_many_watch_or_individual: this.params.howManyWatchOrIndividual,
                how_many_teached_or_interfering: this.params.howManyTeachedOrInterfering,
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
        //על כמה שיעורי סמינר כתה תרצי לדווח
        await this.send(
            this.warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askHowManyLessonsSeminarKita },
                'howManyLessons', 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [1, 2, 3, 4, 5, 6, 7, 8] })
        );

        // מתוכם כמה שיעורי צפיה או פרטני
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyWatchOrIndividual },
                'howManyWatchOrIndividual', 'tap', { max: 1, min: 1, block_asterisk: true })
        );

        // כמה שיעורי מסירה או מעורבות
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyTeachedOrInterfering },
                'howManyTeachedOrInterfering', 'tap', { max: 1, min: 1, block_asterisk: true })
        );

        // כמה שיעורי דיון
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyDiscussingLessons },
                'howManyDiscussingLessons', 'tap', { max: 1, min: 1, block_asterisk: true, digits_allowed: [0, 1] })
        );

        // כמה שיעורים התלמידות חסרו מסיבות אישיות
        await this.send(
            this.read({ type: 'text', text: this.texts.askHowManyLessonsAbsenceSeminarKita },
                'howManyLessonsAbsence', 'tap', { max: 1, min: 1, block_asterisk: true })
        );

        await this.validateNoMoreThanTenAbsences();

        await this.validateSeminarKitaLessonCount();
    }

    async getTrainingReport() {
        //לא בשימוש
    }

    async getManhaReport() {
        //האם מדווחת על עצמה או על מורות אחרות?
        await this.send(
            this.warningMsgIfExists(),
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
            await this.getTeacherFourLastDigits()
            //האם תעריף חוליה או תעריף כיתתי?
            await this.send(
                this.read({ type: 'text', text: this.texts.askIsTaarifHulia },
                    'isTaarifHulia', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //כמה שיעורי צפיה?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyWatchedLessons },
                    'howManyWatchedLessons', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //כמה בנות מסרו היום שיעור?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyStudentsTeached },
                    'howManyStudentsTeached', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //אם התשובה גדולה מ0 אז  
            //הקישי את מ.ז. של התלמידה-  וחוזר על עצמו כמספר התלמידות שהמורה הקלידה שמסרו.
            if (this.params.howManyStudentsTeached != 0) {
                for (let index = 0; index < +this.params.howManyStudentsTeached; index++) {
                    await this.getTeachedStudentTz();
                    this.params.teachedStudentTz = (this.params.teachedStudentTz || '') + this.params.partialTeachedStudentTz + ',';
                }
            }
            //כמה שיעורי ילקוט הרועים?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyYalkutLessons },
                    'howManyYalkutLessons', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //כמה שיעורי דיון?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyDiscussingLessons },
                    'howManyDiscussingLessons', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            //ובסיום האם תרצי לדווח על מורה נוספת   
            //not implemented yet     
        }
    }

    async getReponsibleReport() {
        //לא בשימוש
    }

    async getPdsReport() {
        //האם התלמידות חסרו?
        await this.send(
            this.warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askWasStudentAbsence },
                'wasStudentAbsence', 'tap', { max: 1, min: 1, block_asterisk: true })
        );
        if (this.params.wasStudentAbsence == 1) {
            //כמה שיעורים חסרו?
            await this.send(
                this.read({ type: 'text', text: this.texts.askHowManyLessonsAbsence },
                    'howManyLessonsAbsence', 'tap', { max: 1, min: 1, block_asterisk: true })
            );

            await validateNoMoreThanTenAbsences();
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
            this.warningMsgIfExists(),
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
            this.warningMsgIfExists(),
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


    //helpers
    async getTeacherFourLastDigits() {
        //הקישי 4 ספרות אחרונות של הטלפון של המורה
        await this.send(
            this.warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askFourLastDigitsOfTeacherPhone },
                'fourLastDigitsOfTeacherPhone', 'tap', { max: 4, min: 4, block_asterisk: true })
        );
        const teacherToReportFor = await queryHelper.getTeacherByFourLastDigits(this.user.id, this.params.fourLastDigitsOfTeacherPhone);
        if (!teacherToReportFor) {
            this.warningMsg = this.texts.noTeacherWasFoundByFourLastDigits;
            return this.getTeacherFourLastDigits();
        }
        else {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.askFourLastDigitsConfirm, teacherToReportFor.name) },
                    'fourLastDigitsConfirm', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            if (this.params.fourLastDigitsConfirm == 2) {
                return this.getTeacherFourLastDigits();
            }
        }
    }

    async getTeachedStudentTz() {
        //הקישי את מ.ז. של התלמידה
        await this.send(
            this.warningMsgIfExists(),
            this.read({ type: 'text', text: this.texts.askPartialTeachedStudentTz },
                'partialTeachedStudentTz', 'tap', { max: 9, min: 9, block_asterisk: true })
        );
        const teachedStudent = await queryHelper.getStudentByTz(this.user.id, this.params.partialTeachedStudentTz);
        if (!teachedStudent) {
            this.warningMsg = this.texts.noTeachedStudentFound;
            return this.getTeachedStudentTz();
        }
        else {
            await this.send(
                this.read({ type: 'text', text: format(this.texts.askTeachedStudentConfirm, teachedStudent.name) },
                    'teachedStudentConfirm', 'tap', { max: 1, min: 1, block_asterisk: true })
            );
            if (this.params.teachedStudentConfirm == 2) {
                return this.getTeachedStudentTz();
            }
        }
    }

    async validateNoMoreThanTenAbsences() {
        //לא לאפשר יותר מ 10 חיסורים 
        const existingAbsences = await queryHelper.getAbsencesCountForTeacher(this.user.id, this.teacher.id);
        if (existingAbsences + this.params.howManyLessonsAbsence - (this.existingReport?.how_many_lessons_absence ?? 0) > 10) {
            await this.send(
                this.id_list_message({ type: 'text', text: this.texts.validationErrorCannotReportMoreThanTenAbsences }),
                this.hangup()
            );
        }
    }

    async validateSeminarKitaLessonCount() {
        //סה"כ שיעורים שמורה מדווחת בפועל צריך להיות תואם למספר שהקישה שרוצה לדווח
        const totalCount = this.params.howManyLessons;
        const reportedCount = Number(this.params.howManyWatchOrIndividual) +
            Number(this.params.howManyTeachedOrInterfering) +
            Number(this.params.howManyDiscussingLessons) +
            Number(this.params.howManyLessonsAbsence);
        if (totalCount != reportedCount) {
            await this.send(
                this.id_list_message({ type: 'text', text: this.texts.validationErrorSeminarKitaLessonCount }),
                this.hangup()
            );
        }
    }
}