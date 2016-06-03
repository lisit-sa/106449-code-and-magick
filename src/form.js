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
  var getForm = document.querySelector('.review-form');
  var getMark = document.querySelector('.review-form-group-mark');
  var getName = document.querySelector('#review-name');
  var getText = document.querySelector('#review-text');
  var labelForName = document.querySelector('.review-fields-name');
  var labelForText = document.querySelector('.review-fields-text');
  var blockError = document.querySelector('.review-fields');
  var btnSubmit = document.querySelector('.review-submit');
  var errorName = document.querySelector('.error-name-valid-message');
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
    getName.addEventListener('input', function() {
      if (getName.value.length > 1) {
        labelForName.style.display = 'none';
        errorName.style.display = 'none';
        blockError.style.display = 'none';
        btnSubmit.disabled = false;
        getMark.addEventListener('click', function(event) {
          var getMarkChecked = event.target;

          if (getMarkChecked.value < 3) {
            getText.required = true;
            labelForText.style.display = 'inline-block';
            btnSubmit.disabled = true;
          }
        });
      } else {
        labelForName.style.display = 'inline-block';
        blockError.style.display = 'inline-block';
        errorName.innerHTML = 'Неправильный ввод';
        btnSubmit.disabled = true;
      }
    });

    getText.addEventListener('input', function() {
      if (getText.value.length > 1) {
        blockError.style.display = 'none';
        labelForText.style.display = 'none';
        errorText.style.display = 'none';
        btnSubmit.disabled = false;
        if (getName.value.length < 1) {
          btnSubmit.disabled = true;
          labelForName.style.display = 'inline-block';
          blockError.style.display = 'inline-block';
        }
      } else {
        errorText.innerHTML = 'Неправильный ввод';
        blockError.style.display = 'inline-block';
        labelForText.style.display = 'inline-block';
        btnSubmit.disabled = true;
        errorText.style.display = 'inline-block';
      }
    });

    getMark.addEventListener('click', function(event) {
      var getMarkChecked = event.target;

      if (getMarkChecked.value < 3) {
        getText.required = true;
        labelForText.style.display = 'inline-block';
        btnSubmit.disabled = true;
        blockError.style.display = 'inline-block';
        if (getText.checkValidity()) {
          btnSubmit.disabled = false;
        } else {
          labelForText.style.display = 'inline-block';
          blockError.style.display = 'inline-block';
          btnSubmit.disabled = true;
        }
        getName.addEventListener('input', function() {
          if (getName.value.length > 1) {
            labelForName.style.display = 'none';
            errorName.style.display = 'none';
            btnSubmit.disabled = true;
            blockError.style.display = 'inline-block';
            labelForText.style.display = 'inline-blocks';
          }
        });
      } else {
        getText.required = false;
        labelForText.style.display = 'none';
      }
    });
  }

  validate();
  getForm.onsubmit = function() {
    getMark.removeEventListener('click');
    getName.removeEventListener('input');
    getText.removeEventListener('input');
  };

})();
