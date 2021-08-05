import { getPdfStreamFromHtml, renderEjsTemplate } from '../../common-modules/server/utils/template';
import path from 'path';
import { getDiaryDataByGroupId } from './queryHelper';

const templatesDir = path.join(__dirname, '..', '..', 'public', 'templates');

export async function getDiaryStream(groupId, lessonCount = 8) {
    const templatePath = path.join(templatesDir, "diary.ejs");
    const templateData = await getDiaryDataByGroupId(groupId);
    templateData.lessonCount = lessonCount;
    const html = await renderEjsTemplate(templatePath, templateData);
    const pdfStream = await getPdfStreamFromHtml(html);
    return pdfStream;
}

getDiaryStream(1)