var EVENT_HANDLER_REGEX = /^on[A-Z]/;

// We want to differentiate between "onclick" and "onClick" attributes.
// The latter we process, the former we do not.
var originalProperCaseAttributeName = HTMLTools.properCaseAttributeName;
HTMLTools.properCaseAttributeName = function (name) {
  if (EVENT_HANDLER_REGEX.test(name)) {
    return name;
  }
  else {
    return originalProperCaseAttributeName(name);
  }
};

var originalVisitAttribute = SpacebarsCompiler._TemplateTagReplacer.prototype.visitAttribute;
SpacebarsCompiler._TemplateTagReplacer.prototype.visitAttribute = function (name, value, tag) {
  var self = this;

  if (EVENT_HANDLER_REGEX.test(name)) {
    self.inEventHandlerAttributeValue = true;
    if (!value) {
      // If value of the event handler is not specified,
      // we use component method with the same name.
      value = new SpacebarsCompiler.TemplateTag();
      value.type = 'DOUBLE';
      value.path = [name];
      value.args = [];
    }
    var result = originalVisitAttribute.call(self, name, value, tag);
    self.inEventHandlerAttributeValue = false;
    return result;
  }
  else {
    return originalVisitAttribute.call(self, name, value, tag);
  }
};

var originalVisitObject = SpacebarsCompiler._TemplateTagReplacer.prototype.visitObject;
SpacebarsCompiler._TemplateTagReplacer.prototype.visitObject = function (x) {
  var self = this;

  if (x instanceof HTMLTools.TemplateTag && self.inEventHandlerAttributeValue) {
    x.eventHandler = true;
  }

  return originalVisitObject.call(self, x);
};

var originalCodeGenTemplateTag = SpacebarsCompiler.CodeGen.prototype.codeGenTemplateTag;
SpacebarsCompiler.CodeGen.prototype.codeGenTemplateTag = function (tag) {
  var self = this;

  if (tag.eventHandler) {
    self.inEventHandler = true;
  }
  var result = originalCodeGenTemplateTag.call(self, tag);
  if (tag.eventHandler) {
    self.inEventHandler = false;
  }
  return result;
};

var originalCodeGenMustache = SpacebarsCompiler.CodeGen.prototype.codeGenMustache;
SpacebarsCompiler.CodeGen.prototype.codeGenMustache = function (path, args, mustacheType) {
  var self = this;

  if (self.inEventHandler) {
    var nameCode = self.codeGenPath(path);
    var argCode = self.codeGenMustacheArgs(args);
    return 'Spacebars.event(' + nameCode + (argCode ? ', ' + argCode.join(', ') : '') + ')';
  }
  else {
    return originalCodeGenMustache.call(self, path, args, mustacheType);
  }
};