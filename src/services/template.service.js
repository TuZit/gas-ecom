import {
  BadRequestError,
  NotFoundError,
} from "../core/response-handler/error.response.js";
import { htmlEmailToken } from "../core/utils/template.html.js";

async function newTemplate({ tem_name = null, tem_html = null }) {
  // 1. check if template exited
  const template = await templateModel.findOne({ tem_name });
  if (template) {
    throw new BadRequestError("Error: Template already existed");
  }

  // 2. create new template
  const newTemplate = await templateModel.create({
    tem_name,
    tem_html: htmlEmailToken(),
  });
  return newTemplate;
}

async function getTemplate({ tem_name = null }) {
  const template = await templateModel.findOne({ tem_name });
  if (!template) {
    throw new NotFoundError("Error: Template not found");
  }
  return template;
}

export { newTemplate, getTemplate };
