'use strict';

(function() {
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
    setBlockHidden(formContainer, false);
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    Array.prototype.forEach.call(mark, function(markInArray) {
      markInArray.removeEventListener('change', reviewValidate);
      markInArray.removeEventListener('change', setErrorHidden);
    });
    setBlockHidden(formContainer, true);
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

    setBlockHidden(labelText, isCorrectText);
    setBlockHidden(labelName, isCorrectName);
    setBlockHidden(blockError, isFormCorrect);

    btnSubmit.disabled = !isFormCorrect;

  }

  function setBlockHidden(label, setter) {
    label.classList.toggle('invisible', setter);
  }

  function setErrorHidden() {
    setBlockHidden(errorName, name.validity.valid);
    setBlockHidden(errorText, text.validity.valid);
  }

  field.addEventListener('input', reviewValidate);
  field.addEventListener('change', setErrorHidden);

  reviewValidate();
  setErrorHidden();

  form.onsubmit = function() {
    field.removeEventListener('change');
    field.removeEventListener('input');
    Array.prototype.forEach.call(mark, function(markInArray) {
      markInArray.removeEventListener('change', reviewValidate);
      markInArray.removeEventListener('change', setErrorHidden);
    });
  };

  var browserCookies = require('browser-cookies');

  name.value = browserCookies.get('name') || '';
  mark.value = browserCookies.get('mark') || '3';

  function expireCookie() {
    var thisDate = new Date();
    var thisYear = thisDate.getFullYear();
    var birthday = new Date(thisYear, 1, 15);

    if (thisDate < birthday) {
      birthday.setFullYear(thisYear - 1);
    }
    return Math.round((thisDate - birthday) / 24 / 60 / 60 / 1000);
  }

  form.onsubmit = function(event) {
    event.preventDefault();
    browserCookies.set('name', name.value, {
      expires: expireCookie

    });

    browserCookies.set('mark', mark.value, {
      expires: expireCookie
    });
    this.submit();
  };
})();


