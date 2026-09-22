# Yemot Phone System - Detailed Flow Documentation

## Overview
The Yemot phone system provides voice-based reporting for teachers through an interactive voice response (IVR) system. Teachers call a designated number and navigate through voice prompts to submit their attendance and activity reports.

## Table of Contents
1. [Call Initialization](#call-initialization)
2. [Authentication Flow](#authentication-flow)  
3. [Question Management](#question-management)
4. [Date Selection Process](#date-selection-process)
5. [Teacher-Type Specific Flows](#teacher-type-specific-flows)
6. [Validation and Confirmation](#validation-and-confirmation)
7. [Error Handling](#error-handling)
8. [Call Termination](#call-termination)

---

## Call Initialization

### Entry Point
- **Endpoint**: `POST /yemot` (webhook from Yemot service)
- **Handler**: `YemotCall` class extends `CallBase` from common-modules
- **Call ID Management**: Unique call ID tracking for session persistence

### System Architecture
```
Yemot Service → Wolf Server → YemotCall Handler → Database
```

### Call Parameters
- `ApiCallId`: Unique identifier for the call session
- `ApiPhone`: Caller's phone number  
- Additional parameters collected during the call flow

---

## Authentication Flow

### Phone Number Recognition
```javascript
// 1. Extract caller's phone number from Yemot API
const phoneNumber = this.params.ApiPhone;

// 2. Match against teacher database
this.teacher = await queryHelper.getTeacherByUserIdAndPhone(
    this.user.id, 
    phoneNumber
);

// 3. Validation check
if (!this.teacher) {
    // Play error message and hang up
    await this.send(
        this.id_list_message({ 
            type: 'text', 
            text: this.texts.phoneIsNotRecognizedInTheSystem 
        }),
        this.hangup()
    );
}
```

### Welcome Message
```javascript
// Personalized greeting
this.globalMsg = format(
    this.texts.welcomeForTeacher, 
    this.teacher.teacher_type_name, 
    this.teacher.name
);
```

**Example Welcome**: "שלום לך מורת סמינר כיתה, שרה כהן" (Hello Seminar Kita teacher, Sarah Cohen)

---

## Question Management

### Dynamic Question System
Questions are teacher-type and context-specific, loaded from the database.

#### Question Loading
```javascript
const questions = await queryHelper.getQuestionsForTeacher(
    this.user.id, 
    this.teacher.id, 
    this.teacher.teacher_type_id, 
    this.teacher.special_question
);
```

#### Question Types

**1. Binary Questions (Yes/No)**
- **Allowed Digits**: `[0, 1]`
- **Example**: "האם היה קמל היום?" (Was there a Kamal today?)
- **Input**: 1 for Yes, 0 for No

**2. Numeric Range Questions**
- **Allowed Digits**: Custom range (e.g., `[1,2,3,4,5,6,7,8]`)
- **Example**: "על כמה שיעורים תרצי לדווח?" (How many lessons do you want to report?)
- **Input**: Single digit from allowed range

**3. Custom Digit Questions**
- **Allowed Digits**: Specific comma-separated values
- **Example**: Teacher type selection
- **Input**: Predefined options only

#### Question Processing Flow
```javascript
for (const question of questions) {
    // Prepare message content
    const messages = [question.content];
    if (!question.allowed_digits) {
        messages.push(this.texts.chooseAnswerForQuestion);
    }

    // Play question and wait for response
    await this.send(
        this.globalMsgIfExists(),
        this.read(
            { type: 'text', text: messages.join(',') },
            'questionAnswer', 
            'tap', 
            {
                max: 1, 
                min: 1, 
                block_asterisk: true,
                digits_allowed: question.allowed_digits?.split(',') || [0, 1]
            }
        )
    );

    // Save answer
    await queryHelper.saveAnswerForQuestion(
        this.user.id, 
        this.teacher.id, 
        question.id, 
        this.params.questionAnswer
    );

    // Check for standalone questions
    if (question.is_standalone) {
        await this.createEmptyReportForAnswers();
        await this.send(
            this.id_list_message({ 
                type: 'text', 
                text: this.texts.dataWasSavedSuccessfully 
            }),
            this.hangup()
        );
    }
}
```

---

## Date Selection Process

### Three Main Options
Teachers can choose how to specify the reporting date:

#### Option 1: Today's Date
```javascript
await this.send(
    this.globalMsgIfExists(),
    this.read(
        { type: 'text', text: this.texts.chooseReportDateType },
        'reportDateType', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

if (this.params.reportDateType === '1') {
    reportDate = moment(); // Current date
}
```

#### Option 2: Custom Date Entry
```javascript
if (this.params.reportDateType === '2') {
    await this.send(
        this.globalMsgIfExists(),
        this.read(
            { type: 'text', text: this.texts.chooseReportDate },
            'reportDate', 
            'tap', 
            { max: 8, min: 8, block_asterisk: true }
        )
    );
    // Format: DDMMYYYY (e.g., 15012024 for January 15, 2024)
    reportDate = moment(this.params.reportDate, 'DDMMYYYY');
}
```

#### Option 3: Review Previous Reports
```javascript
if (this.params.reportDateType === '3') {
    await this.showReports(); // Navigate to reports review flow
}
```

### Date Validation Chain

#### 1. Format Validation
```javascript
const reportDateIsValid = reportDate.isValid();
if (!reportDateIsValid) {
    this.globalMsg = this.texts.validationErrorReportDateIsInvalid;
    return this.getAndValidateReportDate(); // Retry
}
```

#### 2. Future Date Check
```javascript
const reportDateIsFuture = reportDate.isAfter(moment());
if (reportDateIsFuture) {
    this.globalMsg = this.texts.validationErrorCannotReportOnFutureDate;
    return this.getAndValidateReportDate(); // Retry
}
```

#### 3. Working Day Validation
```javascript
const isWorkingDay = await queryHelper.validateWorkingDateForTeacher(
    this.user.id, 
    this.teacher.teacher_type_id, 
    reportDate.format('YYYY-MM-DD')
);
if (!isWorkingDay) {
    this.globalMsg = this.texts.validationErrorCannotReportOnNonWorkingDay;
    return this.getAndValidateReportDate(); // Retry
}
```

#### 4. Previous Month Reporting Rules
```javascript
// For non-Manha teachers (type != 3)
if (this.teacher.teacher_type_id != 3 && !reportDateIsPrevMonth) {
    const unconfirmedPreviousReports = await queryHelper
        .getUnconfirmedPreviousReportsByTeacherAndDates(
            this.user.id, 
            this.teacher.id, 
            startReportsDate, 
            endReportsDate
        );
    
    if (unconfirmedPreviousReports.length > 0) {
        this.globalMsg = this.texts.validationErrorHasUnconfirmedReports;
        delete this.report_date;
        return this.getReportDate(); // Return to date selection
    }
}
```

#### 5. Existing Report Check
```javascript
const existingReports = await queryHelper.getReportsByTeacherIdAndToday(
    this.user.id, 
    this.teacher.id, 
    reportDate.format('YYYY-MM-DD')
);

// Check for non-empty reports
const relevantFields = [
    'how_many_students', 'how_many_methodic', 'is_taarif_hulia',
    'how_many_watch_or_individual', 'was_collective_watch', 'how_many_lessons'
];
this.existingReport = existingReports.find(report => 
    relevantFields.some(field => 
        report[field] !== null && report[field] !== undefined
    )
);

if (this.existingReport) {
    // Check if report is locked
    if (this.existingReport.salaryReport) {
        this.globalMsg = this.texts.validationErrorCannotReportOnSalaryReport;
        return this.getAndValidateReportDate();
    }
    
    if (this.existingReport.is_confirmed) {
        this.globalMsg = this.texts.validationErrorCannotReportOnConfirmedReport;
        return this.getAndValidateReportDate();
    }
    
    // Warn about replacement
    this.globalMsg = this.texts.existingReportWillBeDeleted;
}
```

#### 6. Hebrew Date Confirmation
```javascript
const hebrewDate = formatJewishDateHebrew(getJewishDate(reportDate.toDate()));
await this.send(
    this.globalMsgIfExists(),
    this.read(
        { type: 'text', text: format(this.texts.askReportDateConfirm, hebrewDate) },
        'reportDateConfirm', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

if (this.params.reportDateConfirm == 2) {
    return this.getAndValidateReportDate(); // User rejected, retry
}

this.report_date = reportDate.format('YYYY-MM-DD');
```

---

## Teacher-Type Specific Flows

### 1. Seminar Kita Teachers (Type 1)
**Flow**: Seminary classroom teachers reporting daily activities

#### Student Count Setup
```javascript
this.params.howManyStudents = this.teacher.student_count;
if (!this.params.howManyStudents) {
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askHowManyStudentsSeminarKita },
            'howManyStudents', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
}
```

#### Lesson Count Collection
```javascript
// Total lessons for the day
await this.send(
    this.globalMsgIfExists(),
    this.read(
        { type: 'text', text: this.texts.askHowManyLessonsSeminarKita },
        'howManyLessons', 
        'tap', 
        { 
            max: 1, min: 1, block_asterisk: true, 
            digits_allowed: [1, 2, 3, 4, 5, 6, 7, 8] 
        }
    )
);

// Observation/individual lessons
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyWatchOrIndividual },
        'howManyWatchOrIndividual', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Teaching/interference lessons  
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyTeachedOrInterfering },
        'howManyTeachedOrInterfering', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Kamal assembly
await this.send(
    this.read(
        { type: 'text', text: this.texts.askWasKamal },
        'wasKamal', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Discussion lessons
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyDiscussingLessons },
        'howManyDiscussingLessons', 
        'tap', 
        { 
            max: 1, min: 1, block_asterisk: true, 
            digits_allowed: [0, 1] 
        }
    )
);

// Student absences
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyLessonsAbsenceSeminarKita },
        'howManyLessonsAbsence', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);
```

#### Validations
```javascript
// Absence limit validation
await this.validateNoMoreThanTenAbsences();

// Lesson count balance validation
await this.validateSeminarKitaLessonCount();
```

#### Multi-Day Reporting Option
```javascript
await this.send(
    this.id_list_message({ type: 'text', text: this.texts.dataWasSavedSuccessfully }),
    this.read(
        { type: 'text', text: this.texts.askForAnotherDateReport },
        'anotherDateReport', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

if (this.params.anotherDateReport == 1) {
    return this.getAndValidateReportDate(false); // Loop back for another date
}
```

### 2. Manha Teachers (Type 3)
**Flow**: Supervisory teachers with two reporting modes

#### Report Type Selection
```javascript
await this.send(
    this.globalMsgIfExists(),
    this.read(
        { type: 'text', text: this.texts.askManhaReportType },
        'manhaReportType', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);
```

#### Mode A: Self-Reporting
```javascript
if (this.params.manhaReportType == 1) {
    // Methodology lessons count
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askHowManyMethodic },
            'howManyMethodic', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
}
```

#### Mode B: Reporting on Other Teachers
```javascript
else {
    // Teacher identification
    await this.getTeacherFourLastDigits();
    
    // Hulia observation counts
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askIsTaarifHulia },
            'isTaarifHulia', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
    
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askIsTaarifHulia2 },
            'isTaarifHulia2', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
    
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askIsTaarifHulia3 },
            'isTaarifHulia3', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
    
    // Additional activity counts...
    // (Full implementation includes watched lessons, students taught, etc.)
    
    await this.validateManhaReport();
}
```

#### Teacher Identification Sub-flow
```javascript
async getTeacherFourLastDigits() {
    await this.send(
        this.globalMsgIfExists(),
        this.read(
            { type: 'text', text: this.texts.askFourLastDigitsOfTeacherPhone },
            'fourLastDigitsOfTeacherPhone', 
            'tap', 
            { max: 4, min: 4, block_asterisk: true }
        )
    );
    
    const teachers = await queryHelper.getTeachersByFourLastDigits(
        this.user.id, 
        this.params.fourLastDigitsOfTeacherPhone
    );
    
    if (teachers.length === 0) {
        this.globalMsg = this.texts.noTeacherWasFoundByFourLastDigits;
        return this.getTeacherFourLastDigits(); // Retry
    } 
    else if (teachers.length > 1) {
        // Multiple matches - present selection
        const teacherSelectionStr = teachers
            .map((item, index) => `${item.name}  ${index + 1}`)
            .join(', ');
        
        await this.send(
            this.read(
                { type: 'text', text: format(this.texts.askFourLastDigitsConfirmMulti, teacherSelectionStr) },
                'fourLastDigitsConfirm', 
                'tap', 
                { max: 1, min: 1, block_asterisk: true }
            )
        );
        
        if (this.params.fourLastDigitsConfirm == 0) {
            return this.getTeacherFourLastDigits(); // Retry
        }
        
        this.teacherToReportFor = teachers[this.params.fourLastDigitsConfirm - 1];
    } 
    else {
        this.teacherToReportFor = teachers[0];
    }
    
    // Final confirmation
    await this.send(
        this.read(
            { type: 'text', text: format(this.texts.askFourLastDigitsConfirm, this.teacherToReportFor.name) },
            'fourLastDigitsConfirm', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
    
    if (this.params.fourLastDigitsConfirm == 2) {
        return this.getTeacherFourLastDigits(); // User rejected, retry
    }
}
```

#### Multi-Teacher Reporting Option
```javascript
await this.send(
    this.id_list_message({ type: 'text', text: this.texts.dataWasSavedSuccessfully }),
    this.read(
        { type: 'text', text: this.texts.askForAnotherTeacherReport },
        'anotherTeacherReport', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

if (this.params.anotherTeacherReport == 1) {
    return this.askForReportDataAndSave(); // Loop back for another teacher
}
```

### 3. PDS Teachers (Type 5)
**Flow**: Professional development teachers

```javascript
// Observation/individual lessons
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyWatchOrIndividual },
        'howManyWatchOrIndividual', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Teaching/interference lessons
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyTeachedOrInterfering },
        'howManyTeachedOrInterfering', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Discussion lessons
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyDiscussingLessons },
        'howManyDiscussingLessons', 
        'tap', 
        { 
            max: 1, min: 1, block_asterisk: true, 
            digits_allowed: [0, 1] 
        }
    )
);

await this.validatePdsReport();
```

### 4. Kindergarten Teachers (Type 6)
**Flow**: Kindergarten observation teachers

```javascript
// Collective observation check
await this.send(
    this.globalMsgIfExists(),
    this.read(
        { type: 'text', text: this.texts.askWasCollectiveWatch },
        'wasCollectiveWatch', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

if (this.params.wasCollectiveWatch != 1) {
    // Individual observation details
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askHowManyStudents },
            'howManyStudents', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
    
    // Student performance evaluation
    await this.send(
        this.read(
            { type: 'text', text: this.texts.askWasStudentsGood },
            'wasStudentsGood', 
            'tap', 
            { max: 1, min: 1, block_asterisk: true }
        )
    );
}
```

### 5. Special Education Teachers (Type 7)
**Flow**: Special education teachers

```javascript
// Total lessons
await this.send(
    this.globalMsgIfExists(),
    this.read(
        { type: 'text', text: this.texts.askHowManyLessons },
        'howManyLessons', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Students who observed
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyStudentsWatched },
        'howManyStudentsWatched', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Students who taught
await this.send(
    this.read(
        { type: 'text', text: this.texts.askHowManyStudentsTeached },
        'howManyStudentsTeached', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Phone discussion
await this.send(
    this.read(
        { type: 'text', text: this.texts.askWasPhoneDiscussing },
        'wasPhoneDiscussing', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Training teacher identification
await this.send(
    this.read(
        { type: 'text', text: this.texts.askWhoIsYourTrainingTeacher },
        'whoIsYourTrainingTeacher', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);

// Specialty identification
await this.send(
    this.read(
        { type: 'text', text: this.texts.askWhatIsYourSpeciality },
        'whatIsYourSpeciality', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true }
    )
);
```

---

## Validation and Confirmation

### Business Rule Validations

#### Absence Limit Validation
```javascript
async validateNoMoreThanTenAbsences() {
    const existingAbsences = await queryHelper.getAbsencesCountForTeacher(
        this.user.id, 
        this.teacher.id
    );
    
    const newTotal = existingAbsences + 
        this.params.howManyLessonsAbsence - 
        (this.existingReport?.how_many_lessons_absence ?? 0);
    
    if (newTotal > 10) {
        await this.send(
            this.id_list_message({ 
                type: 'text', 
                text: this.texts.validationErrorCannotReportMoreThanTenAbsences 
            }),
            this.hangup()
        );
    }
}
```

#### Lesson Count Balance Validation
```javascript
async validateSeminarKitaLessonCount() {
    const totalCount = this.params.howManyLessons;
    const reportedCount = 
        Number(this.params.howManyWatchOrIndividual ?? 0) +
        Number(this.params.howManyTeachedOrInterfering ?? 0) +
        Number(this.params.wasKamal ?? 0) +
        Number(this.params.howManyDiscussingLessons ?? 0) +
        Number(this.params.howManyLessonsAbsence ?? 0);
    
    if (totalCount != reportedCount) {
        await this.send(
            this.id_list_message({ 
                type: 'text', 
                text: this.texts.validationErrorSeminarKitaLessonCount 
            }),
            this.hangup()
        );
    }
}
```

#### Manha Report Validation with Summary
```javascript
async validateManhaReport() {
    await this.send(
        this.read({
            type: 'text', 
            text: format(
                this.texts.validationConfirmManhaReport,
                this.teacherToReportFor.name,
                this.params.isTaarifHulia,
                this.params.isTaarifHulia2,
                this.params.howManyWatchedLessons,
                this.params.howManyStudentsTeached,
                this.params.howManyYalkutLessons,
                this.params.howManyDiscussingLessons,
                this.params.howManyStudentsHelpTeached,
                this.params.isTaarifHulia3
            )
        },
        'reportConfirm', 
        'tap', 
        { max: 1, min: 1, block_asterisk: true })
    );
    
    if (this.params.reportConfirm == 2) {
        return this.askForReportDataAndSave(); // Restart if user rejects
    }
}
```

---

## Previous Reports Review Flow

### Month Selection
```javascript
async showReports() {
    await this.send(
        this.read(
            { type: 'text', text: this.texts.chooseReportsMonth },
            'reportsMonth', 
            'tap', 
            { max: 2, min: 1, block_asterisk: true }
        )
    );
    
    const month = Number(this.params.reportsMonth);
    let year = new Date().getFullYear();
    if (month > new Date().getMonth() + 1) {
        year -= 1; // Previous year if month is in the future
    }
    
    const startReportsDate = moment(`01.${month}.${year}`, 'DD.MM.YYYY');
    const endReportsDate = moment(startReportsDate).endOf('month');
    
    const previousReports = await queryHelper
        .getUnconfirmedPreviousReportsByTeacherAndDates(
            this.user.id, 
            this.teacher.id, 
            startReportsDate, 
            endReportsDate
        );
```

### Report Display and Actions
```javascript
    if (previousReports.length == 0) {
        await this.send(
            this.id_list_message({ 
                type: 'text', 
                text: this.texts.noReportFound 
            }),
            this.hangup()
        );
    } else {
        for (const report of previousReports) {
            await this.send(
                this.read(
                    { type: 'text', text: this.getReportMessage(report) },
                    'previousReportConfirm', 
                    'tap', 
                    { max: 1, min: 1, block_asterisk: true }
                )
            );
            
            if (this.params.previousReportConfirm == 9) {
                // Confirm/approve the report
                await queryHelper.saveReportAsConfirmed(report.id);
            } else {
                // Edit the report
                this.existingReport = report;
                this.report_date = moment(report.report_date).format('YYYY-MM-DD');
                return this.getReportAndSave();
            }
        }
    }
}
```

### Report Message Formatting
```javascript
getReportMessage(report) {
    const reportMessages = {
        1: this.texts.seminarKitaPreviousReports,
        2: '', // Training - not in use
        3: this.texts.manhaPreviousReports,
        4: '', // Responsible - not in use
        5: this.texts.pdsPreviousReports,
        6: this.texts.kindergartenPreviousReports,
        7: this.texts.specialEducationPreviousReports,
    };
    
    const hebrewDate = formatJewishDateHebrew(getJewishDate(report.report_date));
    
    const params = {
        1: [hebrewDate, report.how_many_lessons, report.how_many_watch_or_individual, /* ... */],
        3: [hebrewDate, report.how_many_methodic, report.four_last_digits_of_teacher_phone, /* ... */],
        // ... other teacher types
    };
    
    return format(
        reportMessages[this.teacher.teacher_type_id], 
        ...params[this.teacher.teacher_type_id]
    );
}
```

---

## Error Handling

### System Error Categories

#### 1. Authentication Errors
- **Phone Not Recognized**: Clear message, immediate call termination
- **Teacher Deactivated**: Appropriate error message  
- **System Unavailable**: Graceful degradation message

#### 2. Validation Errors
- **Invalid Date Format**: Request re-entry with format instruction
- **Business Rule Violations**: Specific error messages
- **Data Conflicts**: Clear explanation and resolution options

#### 3. Database Errors
```javascript
try {
    const savedReport = await new AttReport(attReport).save();
    // ... success handling
} catch (e) {
    console.log('catch yemot exception', e);
    await this.send(
        this.id_list_message({ 
            type: 'text', 
            text: this.texts.dataWasNotSaved 
        }),
        this.hangup()
    );
}
```

#### 4. Call Processing Errors
- **Timeout Handling**: Automatic retry or graceful termination
- **Invalid Input**: Request re-entry with clearer instructions
- **Call Disconnection**: Session state preservation for reconnection

---

## Call Termination

### Data Persistence
Before ending calls, the system ensures:

#### 1. Report Save Process
```javascript
const attReport = {
    user_id: this.user.id,
    teacher_id: this.teacher.id,
    report_date: this.report_date,
    update_date: new Date(),
    year: defaultYear,
    // ... all collected parameters
};

const savedReport = await new AttReport(attReport).save();

// Handle existing report replacement
if (this.existingReport) {
    await new AttReport().where({ id: this.existingReport.id }).destroy();
    await queryHelper.updateReportIdForExistingReportAnswers(
        this.existingReport.id, 
        savedReport.id
    );
}

// Link question answers to report
await queryHelper.updateReportIdForAnswers(
    this.user.id, 
    this.teacher.id, 
    savedReport.id
);
```

#### 2. Success Confirmation
```javascript
await this.send(
    this.id_list_message({ 
        type: 'text', 
        text: this.texts.dataWasSavedSuccessfully 
    }),
    this.hangup()
);
```

#### 3. Cleanup
```javascript
finally {
    this.end(); // Cleanup call resources
}
```

### Call Flow Completion Messages
- **Successful Save**: "הנתונים נשמרו בהצלחה" (Data saved successfully)
- **No Changes Made**: "לא בוצעו שינויים" (No changes made)  
- **System Error**: "הנתונים לא נשמרו" (Data was not saved)
- **Goodbye Messages**: Role-specific farewell messages

---

## Technical Implementation Notes

### Session Management
- **Call ID Tracking**: Unique identifier for each call session
- **State Persistence**: Parameters maintained throughout call flow
- **Timeout Handling**: Automatic cleanup for abandoned calls

### Input Processing
- **Digit Collection**: Single and multi-digit input handling
- **Validation**: Real-time input validation against allowed values
- **Retry Logic**: Automatic retry for invalid inputs

### Message System
- **Text Retrieval**: Dynamic message loading from database
- **Formatting**: String formatting with parameter substitution
- **Hebrew Support**: Full Hebrew text and date support

### Database Integration
- **Query Optimization**: Efficient database queries for real-time response
- **Transaction Safety**: Atomic operations for data consistency
- **Error Recovery**: Rollback capabilities for failed operations

This comprehensive flow documentation serves as the foundation for understanding the complete Yemot phone system functionality and can guide both maintenance and potential system migration efforts.