# Wolf Teacher Reports - Functional Requirements Document

## System Overview
The Wolf Teacher Reports system provides two primary interfaces for teacher reporting and salary management:

1. **Yemot Phone System** - Voice-based reporting via phone calls
2. **Web UI System** - Browser-based management interface

## Table of Contents
1. [Yemot Phone System Flow](#yemot-phone-system-flow)
2. [Web UI System Pages](#web-ui-system-pages)
3. [User Roles and Permissions](#user-roles-and-permissions)
4. [Data Export Capabilities](#data-export-capabilities)
5. [System Business Rules](#system-business-rules)

---

## Yemot Phone System Flow

### Authentication & Initial Setup
- **Phone Recognition**: System identifies teacher by matching phone number
- **Teacher Validation**: Verifies teacher exists in system and is authorized
- **Welcome Message**: Personalized greeting with teacher type and name
- **Phone Number Mismatch**: If phone not recognized, system ends call with error message

### Question Flow (Optional)
- **Pre-Report Questions**: System may present dynamic questions based on teacher type
- **Question Types**: 
  - Multiple choice (0/1 responses)
  - Custom digit allowed responses
  - Standalone questions (create empty report and end call)
- **Answer Storage**: Responses saved to database linked to teacher and report

### Report Date Selection
**Three Options Available:**
1. **Today's Date**: Report for current date
2. **Custom Date**: Manual date entry (DDMMYYYY format)
3. **View Previous Reports**: Review/modify existing reports

**Date Validation:**
- **Hebrew Date Confirmation**: Shows Hebrew calendar date for verification
- **Working Day Validation**: Checks against teacher-type-specific working dates
- **Previous Report Check**: Warns if report already exists for date
- **Unconfirmed Reports**: Blocks new reports if previous months unconfirmed
- **Salary Report Lock**: Cannot modify reports already processed for salary
- **Future Date Block**: Cannot report on future dates

### Teacher Type Specific Flows

#### 1. Seminar Kita Teachers (Type 1)
**Report Questions:**
- How many students attended today
- How many lessons to report (1-8)
- How many observation/individual lessons
- How many teaching/interference lessons  
- Was there Kamal (special assembly)
- How many discussion lessons (0-1)
- How many lessons with student absences

**Validation:**
- Total lesson count must match sum of reported activities
- Maximum 10 absences per teacher per period
- Cannot exceed student count limits

**Multi-Day Reporting:**
- Option to report additional dates after completing current report
- Loops back to date selection for efficient batch reporting

#### 2. Manha Teachers (Type 3) 
**Two Sub-flows:**

**A. Self-Reporting:**
- How many methodology lessons

**B. Reporting on Other Teachers:**
- Enter 4 last digits of teacher's phone
- Teacher selection/confirmation if multiple matches
- Regular Hulia observation lessons count
- Large Hulia observation lessons count  
- Hulia 2 lessons count
- Total observation lessons
- How many students taught lessons
- Student ID entry for each teaching student (disabled)
- Yalkut Haroim lessons count
- Marathon assistance lessons count

**Validation Summary:**
- Displays all entered data for confirmation
- Option to restart if data incorrect

**Multi-Teacher Reporting:**
- Option to report for additional teachers
- Loops back to teacher selection

#### 3. PDS Teachers (Type 5)
**Report Questions:**
- How many observation/individual lessons
- How many teaching/interference lessons
- How many discussion lessons (0-1)

**Validation:**
- Summary confirmation of all data entered

#### 4. Kindergarten Teachers (Type 6)
**Report Flow:**
- Was there collective observation? (Yes/No)

**If No Collective Observation:**
- How many students observed
- Were students performing well?
- Additional timing questions (disabled)

#### 5. Special Education Teachers (Type 7)
**Report Questions:**
- How many lessons total
- How many students observed
- How many students taught
- Was there phone discussion?
- Who is your training teacher?
- What is your specialty?

#### 6. Training Teachers (Type 2) & Responsible Teachers (Type 4)
- **Status**: Not currently in use

### Report Completion Flow
- **Data Validation**: Final validation of all entered data
- **Database Save**: Creates new attendance report record
- **Existing Report Handling**: Replaces previous report if editing
- **Answer Linking**: Associates question answers with final report
- **Success Confirmation**: Confirms data saved successfully
- **Call Termination**: Ends call with appropriate goodbye message

### Previous Reports Review
- **Month Selection**: Choose which month to review (1-12)
- **Report Display**: Shows existing reports with all details in Hebrew
- **Report Actions Per Item**:
  - Press 9: Confirm/approve the report
  - Press any other key: Edit the report (restarts report flow)
- **No Reports Message**: Informs if no reports found for selected period

### Error Handling
- **Invalid Dates**: Clear error messages for date format issues
- **Non-Working Days**: Prevents reporting on non-work days
- **System Errors**: Graceful failure with "data not saved" message
- **Teacher Not Found**: Clear messaging for unrecognized teachers
- **Validation Failures**: Specific error messages for business rule violations

---

## Web UI System Pages

### 1. Dashboard Page (`/dashboard`)
**Page Type**: Summary Statistics Display
**Functionality**:
- Shows key system metrics and statistics
- No table operations (view-only)
- Real-time data refresh capability

### 2. Main Data Tables Group

#### Teachers Table (`/teachers`)
**Purpose**: Manage teacher records
**Displayed Columns**:
- ID Number (tz) - sortable
- Name - sortable, filterable by text
- Phone Number - filterable by text  
- Email Address
- School - filterable by text
- Teacher Type - dropdown selection, filterable
- Hourly Rate - filterable by text
- Training Teacher - filterable by text
- Special Question - dropdown selection
- Student Count

**Table Operations**:
- ✅ **Sortable**: ID, Name, Teacher Type
- ✅ **Filterable**: ID (like), Name (like), Phone (like), School (like), Teacher Type (like), Rate (like), Training Teacher (like)
- ✅ **Editable**: All fields inline editable
- ✅ **Add New**: Can add new teacher records
- ✅ **Delete**: Can delete teacher records
- ✅ **Export**: CSV and PDF export available
- ✅ **Bulk Operations**: Bulk delete selection
- ✅ **Search**: Global search across all fields

#### Students Table (`/students`)
**Purpose**: Manage student records
**Displayed Columns**:
- ID Number (tz)
- Name

**Table Operations**:
- ✅ **Sortable**: All columns
- ✅ **Filterable**: ID (like), Name (like)
- ✅ **Editable**: All fields inline editable
- ✅ **Add New**: Can add new student records
- ✅ **Delete**: Can delete student records
- ✅ **Export**: CSV and PDF export available
- ✅ **Search**: Global search across all fields

#### Attendance Types Table (`/att-types`)
**Purpose**: Manage attendance categories
**Displayed Columns**:
- Key (identifier)
- Name (description)

**Table Operations**:
- ✅ **Sortable**: All columns
- ✅ **Filterable**: Text-based filtering
- ✅ **Editable**: Inline editing
- ✅ **CRUD**: Full create, read, update, delete
- ✅ **Export**: CSV and PDF export

#### Teacher Types Table (`/teacher-types`)
**Purpose**: Manage teacher categories and roles
**Displayed Columns**:
- Key (identifier)
- Name (description)

**Table Operations**:
- ✅ **Sortable**: All columns
- ✅ **Filterable**: Text-based filtering
- ✅ **Editable**: Inline editing
- ✅ **CRUD**: Full create, read, update, delete
- ✅ **Export**: CSV and PDF export

#### Prices Table (`/prices`)
**Purpose**: Manage pricing configurations for salary calculations
**Table Operations**:
- ✅ **Sortable**: All columns
- ✅ **Filterable**: Multiple filter types
- ✅ **Editable**: Inline editing for price updates
- ✅ **CRUD**: Full create, read, update, delete
- ✅ **Export**: CSV and PDF export

#### Texts Table (`/texts`)
**Purpose**: Manage system text messages and prompts (for Yemot system)
**Table Operations**:
- ✅ **Sortable**: All columns
- ✅ **Filterable**: Text-based search
- ✅ **Editable**: Inline text editing
- ✅ **CRUD**: Full create, read, update, delete
- ✅ **Export**: CSV and PDF export

#### Questions Table (`/questions`)
**Purpose**: Manage dynamic questions for Yemot phone system
**Table Operations**:
- ✅ **Sortable**: All columns
- ✅ **Filterable**: Multiple criteria
- ✅ **Editable**: Question content and settings
- ✅ **CRUD**: Full create, read, update, delete
- ✅ **Export**: CSV and PDF export

#### Working Dates Table (`/working-dates`)
**Purpose**: Manage work calendar by teacher type
**Displayed Columns**:
- Date
- Teacher Type
- Working Status

**Table Operations**:
- ✅ **Sortable**: Date, Teacher Type
- ✅ **Filterable**: Date range, Teacher Type
- ✅ **Editable**: Working status toggle
- ✅ **CRUD**: Full create, read, update, delete
- ✅ **Export**: CSV and PDF export

### 3. Reports Group

#### All Reports Table (`/att-reports`)
**Purpose**: View all attendance reports across teacher types
**Displayed Columns**:
- Teacher Name - sortable, filterable with autocomplete
- Teacher Type - sortable by join
- Training Teacher - sortable by join
- School - sortable
- Report Date - date type, sortable
- Hebrew Report Date - display only
- Day of Week - display only
- Update Date - date type
- Confirmed Status - boolean toggle
- Methodology Lessons - numeric
- Phone Last 4 Digits
- Teacher Reported For - autocomplete selection
- Various lesson counts and activity fields
- Student counts and performance metrics

**Advanced Table Operations**:
- ✅ **Sortable**: Teacher Name, Teacher Type, School, Dates
- ✅ **Filterable**: All major fields with appropriate filter types
- ✅ **Editable**: Most fields inline editable
- ✅ **Add New**: Can create new reports
- ✅ **Delete**: Can delete reports
- ✅ **Export**: CSV and PDF export with landscape option
- ✅ **Bulk Operations**: Bulk delete capability
- ✅ **Complex Filtering**: Multiple simultaneous filters

#### Teacher-Type Specific Report Views

**Seminar Kita Reports** (`/seminar-kita-reports`)
- **Filtered View**: Shows only teacher type 1 reports
- **Specific Columns**: Lesson counts, student attendance, methodology
- **Same Operations**: All standard table operations available

**Manha Reports** (`/manha-reports`) 
- **Filtered View**: Shows only teacher type 3 reports
- **Specific Columns**: Observation lessons, student teaching data, Hulia counts
- **Same Operations**: All standard table operations available

**PDS Reports** (`/pds-reports`)
- **Filtered View**: Shows only teacher type 5 reports
- **Specific Columns**: Individual lessons, teaching/interference counts
- **Same Operations**: All standard table operations available

**Special Education Reports** (`/special-education-reports`)
- **Filtered View**: Shows only teacher type 7 reports
- **Specific Columns**: Lesson counts, student observation/teaching data
- **Same Operations**: All standard table operations available

**Kindergarten Reports** (`/kindergarten-reports`)
- **Filtered View**: Shows only teacher type 6 reports
- **Specific Columns**: Student counts, performance metrics, collective observation
- **Same Operations**: All standard table operations available

#### Total Monthly Reports (`/total-monthly-reports`)
**Purpose**: Aggregated monthly reporting for salary calculations
**Functionality**:
- **Monthly Grouping**: Reports grouped by month and teacher
- **Salary Calculations**: Computed totals for payment processing
- **Summary Data**: Aggregated lesson counts and rates
- **Export Focus**: Designed for accounting and payroll export

#### Answers Table (`/answers`)
**Purpose**: View responses to dynamic questions from phone system
**Displayed Columns**:
- Teacher information
- Question content
- Answer provided
- Date/time of response

**Table Operations**:
- ✅ **Sortable**: Teacher, Date, Question
- ✅ **Filterable**: Teacher, Date range, Question type
- ✅ **View/Edit**: Review and modify answers
- ✅ **Export**: CSV and PDF export
- ✅ **Delete**: Remove answer records

### 4. File Management

#### Excel Import (`/excel-import`)
**Purpose**: Bulk data import from spreadsheet files
**Functionality**:
- **File Upload**: Support for Excel (.xlsx) and CSV files
- **Data Mapping**: Map spreadsheet columns to database fields
- **Validation**: Pre-import data validation and error reporting
- **Preview**: Show import results before committing
- **Batch Processing**: Handle large file imports
- **Error Handling**: Detailed error messages for failed imports
- **Supported Entities**: Teachers, Students, Working Dates, Prices

---

## Universal Table Features

All data tables in the system include the following standard features:

### Core Table Operations
- ✅ **Pagination**: Server-side pagination for large datasets
- ✅ **Sorting**: Multi-column sorting with visual indicators
- ✅ **Filtering**: Advanced filtering with multiple operators (like, equals, range)
- ✅ **Search**: Global search across visible columns
- ✅ **Refresh**: Manual data refresh capability

### Data Manipulation
- ✅ **Inline Editing**: Edit data directly in table cells
- ✅ **Add New Records**: Create new entries with validation
- ✅ **Delete Records**: Single and bulk delete operations
- ✅ **Validation**: Real-time data validation with error messages

### Export Options
- ✅ **CSV Export**: Full data export in CSV format
- ✅ **PDF Export**: Formatted PDF reports (portrait/landscape)
- ✅ **Filtered Export**: Export respects current filters and sorting
- ✅ **Custom Columns**: Select specific columns for export

### User Experience
- ✅ **Hebrew RTL Support**: Right-to-left text rendering
- ✅ **Responsive Design**: Mobile-friendly table layouts
- ✅ **Loading States**: Visual feedback during data operations
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Confirmation Dialogs**: Protect against accidental deletions

---

## User Roles and Permissions

### System Access Levels
1. **Administrator**: Full system access
2. **Manager**: Read/write access to reports and configuration
3. **Teacher**: Limited access to own reports (via phone system)

### Permission Matrix
- **Tables Management**: Admin/Manager write access
- **Report Viewing**: All roles can view appropriate reports
- **Report Creation**: Phone system (teachers), Web UI (admin/manager)
- **Data Export**: Admin/Manager only
- **System Configuration**: Admin only

---

## Data Export Capabilities

### Export Formats
1. **CSV Files**: 
   - Raw data export
   - Preserves all field values
   - Compatible with Excel and other tools

2. **PDF Reports**:
   - Formatted presentation
   - Print-ready layouts
   - Landscape/portrait options
   - Hebrew text support

### Export Scope Options
- **Current View**: Export visible/filtered data only
- **All Data**: Export complete dataset
- **Selected Rows**: Export only selected items
- **Custom Date Ranges**: Filter by date before export

### Automated Export Features
- **Scheduled Exports**: Automatic monthly/weekly reports
- **Email Delivery**: Send exports to configured recipients
- **Archive Storage**: Historical export retention

---

## System Business Rules

### Phone System Rules
1. **Authentication**: Must use registered phone number
2. **Working Days**: Can only report on configured working days
3. **Date Restrictions**: Cannot report future dates or locked periods
4. **Report Limits**: Maximum one report per day per teacher (with override)
5. **Validation**: All lesson counts must balance according to teacher type rules

### Web System Rules
1. **Data Consistency**: Referential integrity enforced
2. **Hebrew Calendar**: Automatic Hebrew date calculations
3. **Salary Integration**: Reports lock once processed for salary
4. **Audit Trail**: All changes logged with user and timestamp
5. **Backup Rules**: Automatic backups before bulk operations

### Business Process Rules
1. **Report Approval**: Monthly report confirmation required
2. **Salary Calculation**: Automated based on teacher type and lesson counts
3. **Holiday Handling**: Hebrew calendar integration for scheduling
4. **Academic Year**: Year-based data organization and rollover
5. **Data Retention**: Historical data preserved for audit purposes