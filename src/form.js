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

    setErrorHidden(name, errorName);
    setErrorHidden(text, errorText);

    btnSubmit.disabled = !isFormCorrect;

  }

  function setBlockHidden(label, setter) {
    label.classList.toggle('invisible', setter);
  }

  function setErrorHidden(el, error) {
    el.addEventListener('input', function() {
      if(+el.value.length < 2) {
        error.innerHTML = 'Неправильный ввод';
      } else {
        error.classList.toggle('invisible');
      }
    });
  }

  field.addEventListener('input', reviewValidate);
  form.addEventListener('change', reviewValidate);

  reviewValidate();

  form.onsubmit = function() {
    setErrorHidden.removeEventListener('input');
    field.removeEventListener('input');
    form.removeEventListener('change');
  };
})();
