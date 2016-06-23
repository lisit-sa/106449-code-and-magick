'use strict';

(function() {
  var utilities = require('./utilities');
//находим контейнер и его элементы
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
//находим оценки
  var form = document.querySelector('.review-form');
  var mark = form.elements.namedItem('review-mark');
//находим поля
  var name = form.querySelector('#review-name');
  var text = form.querySelector('#review-text');
  var field = form.querySelector('.field-wrap');
  var labelName = form.querySelector('.review-fields-name');
  var labelText = form.querySelector('.review-fields-text');
//находим вспомогательные элементы
  var blockError = form.querySelector('.review-fields');
  var btnSubmit = form.querySelector('.review-submit');
  var errorName = form.querySelector('.error-name-valid-message');
  var errorText = form.querySelector('.error-text-valid-message');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    Array.prototype.forEach.call(mark, function(markInArray) {
      markInArray.addEventListener('change', reviewValidate);
      markInArray.addEventListener('change', setErrorHidden);
    });
    utilities.setBlockHidden(formContainer, false);
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    Array.prototype.forEach.call(mark, function(markInArray) {
      markInArray.removeEventListener('change', reviewValidate);
      markInArray.removeEventListener('change', setErrorHidden);
    });
    utilities.setBlockHidden(formContainer, true);
  };

  /** Присваиваем при загрузке страницы кнопке аттрибут disable
  */
  name.required = true;
  /** Начинаем валидацию
  */
  function inputValidate(element) {
    return !element.required || Boolean(element.value.trim());
  }

  function reviewValidate() {
    text.required = +mark.value < 3;

    var isCorrectName = inputValidate(name);
    var isCorrectText = inputValidate(text);
    var isFormCorrect = isCorrectText && isCorrectName;

    utilities.setBlockHidden(labelText, isCorrectText);
    utilities.setBlockHidden(labelName, isCorrectName);
    utilities.setBlockHidden(blockError, isFormCorrect);

    btnSubmit.disabled = !isFormCorrect;

  }

  function setErrorHidden() {
    utilities.setBlockHidden(errorName, name.validity.valid);
    utilities.setBlockHidden(errorText, text.validity.valid);
  }

  field.addEventListener('input', reviewValidate);
  field.addEventListener('change', setErrorHidden);

  reviewValidate();
  setErrorHidden();

  var browserCookies = require('browser-cookies');

  name.value = browserCookies.get('name') || '';
  mark.value = browserCookies.get('mark') || '3';

  form.onsubmit = function() {
    browserCookies.set('name', name.value, {
      expires: utilities.expireCookie
    });
    browserCookies.set('mark', mark.value, {
      expires: utilities.expireCookie
    });
    field.removeEventListener('change');
    field.removeEventListener('input');
    Array.prototype.forEach.call(mark, function(markInArray) {
      markInArray.removeEventListener('change', reviewValidate);
      markInArray.removeEventListener('change', setErrorHidden);
    });
    this.submit();
  };
})();
