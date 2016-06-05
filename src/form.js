'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };
  /** Валидация формы - выносим переменные
  */
  var form = document.querySelector('.review-form');
  var mark = form.elements.namedItem('review-mark');
  var reviewMark = document.querySelectorAll('input[name="review-mark"]');
  var name = form.querySelector('#review-name');
  var text = form.querySelector('#review-text');
  var field = form.querySelector('.field-wrap');
  var labelName = form.querySelector('.review-fields-name');
  var labelText = form.querySelector('.review-fields-text');
  var blockError = form.querySelector('.review-fields');
  var btnSubmit = form.querySelector('.review-submit');
  var errorName = form.querySelector('.error-name-valid-message');
  var errorText = form.querySelector('.error-text-valid-message');

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
    if(name.validity.valid) {
      errorName.classList.add('invisible');
    } else {
      errorName.innerHTML = 'Пожалуйста, введите значение';
      errorName.classList.remove('invisible');
    }

    if(text.validity.valid) {
      errorText.classList.add('invisible');
    } else {
      errorText.innerHTML = 'Пожалуйста, введите значение';
      errorText.classList.remove('invisible');
    }
  }

  field.addEventListener('input', reviewValidate);
  field.addEventListener('input', setErrorHidden);

  for (var i = 0; i < reviewMark.length; i++) {
    reviewMark[i].addEventListener('change', reviewValidate);
  }
  for (var n = 0; n < reviewMark.length; n++) {
    reviewMark[n].addEventListener('change', setErrorHidden);
  }

  reviewValidate();

  form.onsubmit = function() {
    field.removeEventListener('input');
    reviewMark[n].removeEventListener('change');
  };

  formCloseButton.onclick = function() {
    field.removeEventListener('input');
    reviewMark[n].removeEventListener('change');
  };
})();
