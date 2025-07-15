# Wolf Teacher Reports - System Requirements Document

## Overview
The Wolf Teacher Reports system is a comprehensive teacher reporting and salary calculation platform designed for educational institutions. The system manages multiple types of teachers, tracks their activities, calculates salaries based on complex business rules, and provides reporting capabilities. The system integrates with phone services (Yemot) for voice-based reporting.

## System Architecture

### Technology Stack
- **Backend**: Node.js, Express.js 5.0.0-alpha.7
- **Frontend**: React 16.13.1, Redux, Material-UI 4.12.3
- **Database**: MySQL
- **ORM**: Bookshelf.js 1.2.0 with Knex.js 0.21.2 query builder
- **Authentication**: JWT tokens with bcrypt 5.0.0
- **Phone Integration**: Yemot phone system
- **Localization**: Hebrew (RTL support with jss-rtl)
- **PDF Generation**: html-pdf 3.0.1
- **Excel Processing**: xlsx 0.16.9
- **Build System**: Webpack 4.43.0, Babel 7.x

### Core Dependencies
- Material-UI 4.12.3 for UI components with Hebrew locale
- Moment.js 2.29.1 for date handling
- Jewish-dates-core 1.0.9 for Hebrew calendar calculations
- Archiver 5.3.0 for file compression
- Winston 3.3.3 for logging
- Helmet 3.23.3 for security headers
- CORS 2.8.5 for cross-origin requests
- Morgan 1.9.1 for HTTP request logging
- Compression 1.7.4 for response compression

### Development Dependencies
- Babel ecosystem for ES6+ transpilation
- ESLint for code linting
- Prettier for code formatting
- Webpack dev server for hot reloading
- Nodemon/babel-watch for development server

## Database Schema

### Core Entities

#### users
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, NOT NULL)
- `password` (VARCHAR, NOT NULL) - bcrypt hashed
- `phone_number` (VARCHAR) - for phone system integration
- `active` (BOOLEAN, DEFAULT FALSE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### teachers
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `tz` (VARCHAR) - Israeli ID number
- `name` (VARCHAR)
- `phone` (VARCHAR)
- `email` (VARCHAR)
- `school` (VARCHAR)
- `teacher_type_id` (INTEGER) - Links to teacher_types.key
- `price` (DECIMAL) - Hourly wage
- `training_teacher` (VARCHAR)
- `special_question` (INTEGER) - Links to questions.id
- `student_count` (INTEGER)

#### students
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `tz` (VARCHAR) - Israeli ID number
- `name` (VARCHAR)
- `phone` (VARCHAR)
- `email` (VARCHAR)

#### teacher_types
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `key` (INTEGER) - Type identifier (1-7)
- `name` (VARCHAR) - Hebrew name
- Types:
  - 1: Seminar Kita (סמינר כיתה)
  - 2: Training Teacher (מורה מאמנת) - Not in use
  - 3: Manha Teacher (מורה מנחה)
  - 4: Responsible (אחראית בית ספר) - Not in use
  - 5: PDS Teacher (מורת פידיאס)
  - 6: Kindergarten (גננות)
  - 7: Special Education (חינוך מיוחד)

#### att_reports (Main reporting table)
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `teacher_id` (FOREIGN KEY to teachers.id)
- `report_date` (DATE)
- `update_date` (DATETIME)
- `year` (VARCHAR)
- `is_confirmed` (BOOLEAN)
- `salaryReport` (INTEGER) - Links to salary_reports.id
- `salary_month` (DATE)
- `comment` (TEXT)

**Type-specific fields:**
- `how_many_students` (INTEGER)
- `how_many_methodic` (INTEGER)
- `four_last_digits_of_teacher_phone` (VARCHAR)
- `is_taarif_hulia` (INTEGER)
- `is_taarif_hulia2` (INTEGER)
- `is_taarif_hulia3` (INTEGER)
- `teached_student_tz` (TEXT)
- `how_many_yalkut_lessons` (INTEGER)
- `how_many_discussing_lessons` (INTEGER)
- `how_many_students_help_teached` (INTEGER)
- `how_many_lessons_absence` (INTEGER)
- `how_many_watched_lessons` (INTEGER)
- `was_discussing` (BOOLEAN)
- `how_many_teached` (INTEGER)
- `how_many_individual` (INTEGER)
- `was_kamal` (INTEGER)
- `how_many_interfering` (INTEGER)
- `how_many_watch_or_individual` (INTEGER)
- `how_many_teached_or_interfering` (INTEGER)
- `was_students_good` (INTEGER)
- `was_students_enter_on_time` (INTEGER)
- `was_students_exit_on_time` (INTEGER)
- `how_many_lessons` (INTEGER)
- `how_many_students_watched` (INTEGER)
- `how_many_students_teached` (INTEGER)
- `was_phone_discussing` (INTEGER)
- `your_training_teacher` (INTEGER)
- `what_speciality` (INTEGER)
- `teacher_to_report_for` (INTEGER) - For Manha teachers reporting on others
- `was_collective_watch` (INTEGER)
- `activity_type` (INTEGER) - Links to att_types.id

#### att_types
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `name` (VARCHAR)

#### prices
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `key` (INTEGER) - Price identifier
- `price` (DECIMAL)
- Predefined keys for different price types (11-15, 24-28, 40-42, 51-60)

#### questions
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `teacher_type_id` (INTEGER)
- `question_type_id` (INTEGER) - Links to question_types.key
- `content` (TEXT) - Hebrew question text
- `allowed_digits` (VARCHAR) - Comma-separated allowed input
- `is_standalone` (BOOLEAN)
- `start_date` (DATE)
- `end_date` (DATE)

#### question_types
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `key` (INTEGER) - Type identifier (1-4)
- Types:
  - 1: Always ask if no answer
  - 2: Ask if no "yes" answer
  - 3: Ask if no "no" answer
  - 4: Special question based on teacher setting

#### answers
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `teacher_id` (FOREIGN KEY to teachers.id)
- `question_id` (FOREIGN KEY to questions.id)
- `report_id` (FOREIGN KEY to att_reports.id)
- `answer` (INTEGER) - 0 or 1
- `answer_date` (DATE)

#### texts
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `key` (VARCHAR) - Message identifier
- `value` (TEXT) - Hebrew message content

#### working_dates
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `teacher_type_id` (INTEGER)
- `working_date` (DATE)

#### salary_reports
- `id` (PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (FOREIGN KEY to users.id)
- `ids` (TEXT) - Comma-separated att_report IDs
- `date` (DATETIME)
- `name` (VARCHAR) - Optional name

#### Views
- `salary_reports_view` - Join of salary_reports with names
- `answers_price` - Calculated pricing for answers

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication with email/password

### Core CRUD Operations
All entities support standard CRUD operations with user-based filtering:

#### Teachers
- `GET /api/teachers` - List teachers with filtering
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher
- `GET /api/teachers/get-edit-data` - Get teacher types and questions for forms

#### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

#### Attendance Reports
- `GET /api/att-reports` - List all reports
- `POST /api/att-reports` - Create report
- `PUT /api/att-reports/:id` - Update report
- `DELETE /api/att-reports/:id` - Delete report
- `GET /api/att-reports/get-edit-data` - Get teachers, att types, teacher types, salary reports

#### Specialized Report Endpoints
- `GET /api/att-reports/getSeminarKitaReport` - Seminar Kita teacher reports
- `GET /api/att-reports/getTrainingReport` - Training teacher reports (not in use)
- `GET /api/att-reports/getManhaReport` - Manha teacher reports
- `GET /api/att-reports/getResponsibleReport` - Responsible reports (not in use)
- `GET /api/att-reports/getPdsReport` - PDS teacher reports
- `GET /api/att-reports/getSpecialEducationReport` - Special education reports
- `GET /api/att-reports/getKindergartenReport` - Kindergarten reports
- `GET /api/att-reports/getTotalPayMonthlyReport` - Monthly salary summary

#### Report Management
- `POST /api/att-reports/updateSalaryMonth` - Update salary month for multiple reports
- `POST /api/att-reports/updateSalaryComment` - Update comment for report
- `POST /api/att-reports/createSalaryReport` - Create salary report grouping
- `POST /api/att-reports/:report/export-pdf` - Export report as PDF

#### Configuration Entities
- `GET/POST/PUT/DELETE /api/att-types` - Attendance types
- `GET/POST/PUT/DELETE /api/teacher-types` - Teacher types
- `GET/POST/PUT/DELETE /api/prices` - Pricing configuration
- `GET/POST/PUT/DELETE /api/texts` - System messages
- `GET/POST/PUT/DELETE /api/working-dates` - Working calendar
- `GET/POST/PUT/DELETE /api/questions` - Questions for teachers
- `GET/POST/PUT/DELETE /api/answers` - Answers to questions

#### Phone Integration
- `POST /api/yemot` - Handle incoming phone calls from Yemot system

#### Dashboard
- `GET /api/dashboard` - Dashboard statistics

## Frontend Routes and Components

### Main Navigation Structure
1. **Dashboard** (`/dashboard`)
2. **Tables** (Dropdown menu)
   - Teachers (`/teachers`)
   - Students (`/students`)
   - Attendance Types (`/att-types`)
   - Teacher Types (`/teacher-types`)
   - Prices (`/prices`)
   - Messages (`/texts`)
   - Questions (`/questions`)
   - Working Dates (`/working-dates`)
3. **File Upload** (`/excel-import`)
4. **Reports** (Dropdown menu)
   - All Reports (`/att-reports`)
   - Seminar Kita Reports (`/seminar-kita-reports`)
   - Manha Reports (`/manha-reports`)
   - PDS Reports (`/pds-reports`)
   - Special Education Reports (`/special-education-reports`)
   - Kindergarten Reports (`/kindergarten-reports`)
   - Monthly Reports (`/total-monthly-reports`)
   - Answers (`/answers`)

### Component Structure
- **Containers**: Redux-connected components handling business logic
- **Components**: Reusable UI components
- **Common Components**: Shared from common-modules (tables, forms, etc.)

### Key Features
- Material-UI based interface with Hebrew RTL support
- Data tables with filtering, sorting, pagination
- CRUD operations with modal dialogs
- PDF export functionality
- Excel import capabilities
- Date handling with Hebrew calendar support

## Phone System Integration (Yemot)

### Call Flow
1. Teacher calls system using their registered phone number
2. System identifies teacher by phone number
3. Teacher is greeted with personalized message
4. System guides through report submission process
5. Data is validated and saved to database

### Supported Teacher Types
- Type 1: Seminar Kita teachers
- Type 3: Manha teachers (can report for self or others)
- Type 5: PDS teachers
- Type 6: Kindergarten teachers
- Type 7: Special education teachers

### Call Features
- **Date Selection**: Today, specific date, or view previous reports
- **Question System**: Dynamic questions based on teacher type and configuration
- **Report Validation**: Business rule validation during input
- **Hebrew Date Confirmation**: Shows Hebrew calendar date for confirmation
- **Report Confirmation**: Allows reviewing and modifying previous unconfirmed reports
- **Multiple Reports**: Manha teachers can report for multiple teachers in one call

### Business Rules in Phone System
- Cannot report more than 10 absences per month
- Cannot report on non-working days
- Cannot modify confirmed reports
- Cannot modify reports linked to salary reports
- Seminar Kita lesson count validation
- Previous report confirmation requirements

## Salary Calculation System

### Price Configuration
Different price keys for different activities:
- **11-15**: Seminar Kita activities
- **24-28**: Special education and kindergarten
- **40-42**: PDS activities  
- **51-60**: Manha activities

### Calculation Logic by Teacher Type

#### Type 1 - Seminar Kita
```
Regular Pay = (
  (watch_or_individual * price[11] + 
   teached_or_interfering * price[12] + 
   discussing_lessons * price[13] + 
   was_kamal * price[14] + 
   lessons_absence * price[15])
  * (0.5 * student_count)
) + extra_answers_pay
```

### Training Teacher Fixed Pricing (Type 2 - Not in use)
- Watch: 60 NIS
- Teach: 50 NIS  
- Discuss: 80 NIS
- Private lesson: 20 NIS

#### Type 3 - Manha
```
Regular Pay = 
  watched_lessons * price[51] +
  students_teached * price[52] +
  yalkut_lessons * price[53] +
  discussing_lessons * price[54] +
  students_help_teached * price[55] +
  methodic * price[56] +
  taarif_hulia * price[57] +
  taarif_hulia2 * price[58] +
  taarif_hulia3 * price[59] +
  extra_answers_pay
```

#### Type 5 - PDS
```
Regular Pay =
  watch_or_individual * price[40] +
  teached_or_interfering * price[42] +
  discussing_lessons * price[41] +
  extra_answers_pay
```

#### Type 6 - Kindergarten
```
Regular Pay =
  was_collective_watch * price[60] +
  students * price[24] +
  was_discussing * price[25] +
  extra_answers_pay
```

#### Type 7 - Special Education
```
Regular Pay =
  (lessons * students_watched * price[26]) +
  students_teached * price[27] +
  was_phone_discussing * price[28] +
  extra_answers_pay
```

### Additional Features
- **Extra Pay**: Calculated from answers to special questions
- **Salary Month Assignment**: Reports can be assigned to specific salary months
- **Comment System**: Comments can be added to reports for salary processing
- **Salary Report Grouping**: Multiple reports can be grouped into salary reports

## Special Business Rules

### Hebrew Year System
- Academic year starts July 1st
- Hebrew year calculation: Gregorian year + 3760
- First available year: 5782 (תש"פ)
- Year display format: Hebrew letters (e.g., תש"פ, תש"צ)
- Default year: Current Hebrew year based on academic calendar
- Year selection persisted in localStorage

### Validation Rules
1. **Absence Limit**: Maximum 10 absences per month per teacher
2. **Lesson Count Validation**: For Seminar Kita, total reported activities must equal declared lesson count
3. **Working Day Validation**: Reports only allowed on configured working days
4. **Report Confirmation**: Teachers must confirm previous unconfirmed reports before new ones
5. **Salary Report Lock**: Confirmed reports and reports in salary groups cannot be modified

### Multi-Language Support
- System supports Hebrew (RTL)
- All user-facing text is in Hebrew
- Phone system messages are configurable in Hebrew
- Database stores Hebrew content

### Question System
- Dynamic questions based on teacher type
- Questions have date ranges for activation
- Different question types control when they appear
- Questions can have restricted input options
- Special questions can be assigned per teacher

## User Management and Security

### Authentication
- JWT token-based authentication
- bcrypt password hashing
- User-based data isolation (all data filtered by user_id)
- Session management through Redux store

### User Roles
- Single user role system
- Each user sees only their own data
- Phone system integration requires user lookup by phone number

## File and Data Management

### Excel Import
- Support for importing data via Excel files
- Accessible through dedicated route (`/excel-import`)

### PDF Export
- Reports can be exported as PDF
- Uses configurable EJS templates in `public/templates/`
- Supports Hebrew RTL layout
- Templates: `header.ejs`, `diary.ejs`

### Data Archiving
- Salary reports group multiple attendance reports
- Reports can be marked as confirmed
- Historical data preserved with timestamps

### Additional System Features

#### Swagger API Documentation
- Available at `/swagger/` endpoint
- Auto-generated from JSDoc comments in route files
- Interactive API testing interface

#### Build and Development
- **Development**: `npm run build` - Webpack dev build + server start
- **Production**: `npm run build:prod` - Optimized webpack build + server start  
- **Hot Reloading**: Webpack HMR in development mode
- **Code Quality**: ESLint + Prettier with pre-commit hooks (Husky + lint-staged)

#### Static Assets
- Swagger UI in `public/swagger/`
- CSS and images in `public/css/` and `public/img/`
- Favicon support

## System Configuration

### Environment Configuration
Required environment variables (from .env file):
```
# Application
APP_PORT=3000
APP_HOST=127.0.0.1

# Environment  
NODE_ENV=development

# Database
DB_CLIENT=mysql
DB_HOST=localhost
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>
DB_NAME=<YOUR_DB_NAME>
DB_PORT=3306
SOCKET_PATH=<YOUR_SOCKET_PATH>

# Logging
LOG_DIR=logs
LOG_LEVEL=debug

# Security
TOKEN_SECRET_KEY=secretkeyforjsonwebtoken
```

### Configurable Elements
- Price settings per user (configurable pricing matrix)
- Working dates per teacher type (calendar configuration)
- System messages for phone system (Hebrew text customization)
- Question configurations (dynamic questionnaire system)
- PDF report templates (EJS templates in public/templates/)

## Open Questions

1. **Common-modules dependency**: The system relies on a git submodule `common-modules` that contains shared components and utilities. What is the exact content and structure of this dependency?

2. **Database Migration Strategy**: Only one migration file exists. Are there additional migrations in the common-modules or are they managed differently?

3. **Yemot API Integration**: What are the exact API specifications and authentication requirements for the Yemot phone system?

4. **User Registration**: How are new users created? Is there an admin interface or registration process?

5. **Data Backup and Recovery**: What backup strategies are currently in place?

6. **Performance Optimization**: Are there any specific performance requirements or bottlenecks identified?

7. **Multi-tenant Architecture**: The system uses user_id filtering - is this intended for multi-tenant use or single organization with multiple users?

8. **Report Template System**: How are PDF templates configured and customized?

9. **Error Handling and Monitoring**: What error tracking and monitoring systems are integrated?

10. **Deployment Strategy**: What is the current deployment process and infrastructure requirements?

11. **API Rate Limiting**: Are there any rate limiting or security measures for the phone API endpoint?

12. **Data Retention Policies**: How long is historical data kept and are there any archiving requirements?