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
  //var getForm = document.querySelector('.review-form');
  //var getMark = document.querySelectorAll('input[name="review-mark"]');
  var getMarkChecked = document.querySelector('input[type=radio]:checked');
  var getName = document.querySelector('#review-name');
  var getText = document.querySelector('#review-text');
  var labelForName = document.querySelector('.review-fields-name');
  var labelForText = document.querySelector('.review-fields-text');
  var blockError = document.querySelector('.review-fields');
  var btnSubmit = document.querySelector('.review-submit');
  //var errorName = document.querySelector('.error-name-valid-message');
  var errorText = document.querySelector('.error-text-valid-message');

  /** Присваиваем при загрузке страницы кнопке аттрибут disable
  */
  btnSubmit.disabled = true;
  /** Включаем required у обязательных полей
  */
  getName.required = true;
  /** При загрузке страницы не показываем блок с тем, что нужно заполнить
  */
  labelForText.style.display = 'none';

  /** Начинаем валидацию
  */
  function validate() {
    if (getMarkChecked.value < 3) {
      getText.required = true;
      labelForText.style.display = 'inline-block';
      btnSubmit.disabled = true;
      if (getText.checkValidity()) {
        btnSubmit.disabled = false;
      } else {
        errorText.innerHTML = 'Неправильный ввод';
      }
    } else {
      getText.required = false;
      btnSubmit.disabled = false;
    }
  }

  getName.oninput = function() {
    if (getName.value.length > 1) {
      labelForName.style.display = 'none';
    } else {
      labelForName.style.display = 'inline-block';
      blockError.style.display = 'inline-block';
    }
    validate();
  };

  getText.oninput = function() {
    if (getText.value.length > 1) {
      getText.style.display = 'none';
    } else {
      labelForText.style.display = 'inline-block';
      blockError = 'inline-block';
    }
    validate();
  };
})();


