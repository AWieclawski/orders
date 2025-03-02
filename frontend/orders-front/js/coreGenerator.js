import * as util from "./utils.js";

/**
 * Enables to build input tag with attributes as HTML
 */
export class FormBuilder {
  preBody;
  tagName;
  inputForm;
  inputType;
  inputName;
  inputValue;
  inputClass;
  inputStyle;
  inputReadonly;

  constructor(tagName, formId, inputType, inputName, inputValue, inputClass) {
    this.preBody = ``;
    this.inputStyle = ``;
    this.inputReadonly = ``;
    this.tagName = !isUndef(tagName) ? `<${tagName}` : `<`;
    this.inputForm = conditionalValue(formId, `form`);
    this.inputType = conditionalValue(inputType, `type`);
    this.inputName = conditionalValue(inputName, `name`);
    this.inputValue = conditionalValue(inputValue, `value`);
    this.inputClass = conditionalValue(inputClass, `class`);
  }

  appendAttributes(preBody, inputStyle, isReadonly) {
    this.preBody = !isUndef(preBody) ? `${preBody}` : ``;
    this.inputStyle = !isUndef(inputStyle) ? `style="${inputStyle}"` : ``;
    isReadonly = !isUndef(isReadonly) ? isReadonly : false;
    this.inputReadonly = isReadonly ? 'readonly' : ``;
  }

  static produceHtmlInputTag(formId, inputType, inputName, inputValue, inputClass) {
    const instance = new FormBuilder("input", formId, inputType, inputName, inputValue, inputClass);
    return FormBuilder.produceHtmlTag(instance);
  }

  static produceSubmitTag(formId, inputValue) {
    const instance = new FormBuilder("input", formId, "submit", null, inputValue, null);
    return FormBuilder.produceHtmlTag(instance);
  }

  static produceFullHtmlInputTag(formId, inputType, inputName, inputValue, inputClass, {
    preBody,
    inputStyle,
    isReadonly
  }) {
    const instance = new FormBuilder("input", formId, inputType, inputName, inputValue, inputClass);
    instance.appendAttributes(preBody, inputStyle, isReadonly);
    return FormBuilder.produceHtmlTag(instance);
  }

  static produceHtmlTag(instance) {
    if (instance instanceof FormBuilder) {
      return `${instance.preBody} ${instance.tagName} ${instance.inputForm} ${instance.inputType} ${instance.inputName} ${instance.inputValue} ${instance.inputClass} ${instance.inputStyle} ${instance.inputReadonly} />`;
    } else {
      console.error(`FormTagBuilder instance failed! ${instance}`)
    }
  }
}

function conditionalValue(value, attribName) {
  return !isUndef(value) ? `${attribName}="${value}"` : ``;
}

export function isUndef(value) {
  return util.isUndef(value);
}

export function getNearestTableAncestor(element) {
  return util.getNearestAncestorByTag(element, 'table');
}

/**
 * returns table row with tag `tr` if any
 * @param element
 * @returns {*}
 */
export function getNearestRowAncestor(element) {
  return util.getNearestAncestorByTag(element, 'tr');
}
