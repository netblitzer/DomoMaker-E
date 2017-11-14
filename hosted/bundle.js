'use strict';

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domoPower').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var sortDomos = function sortDomos(e) {
  e.preventDefault();

  loadSortedDomosFromServer();

  return false;
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    { id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm' },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'power' },
      'Power: '
    ),
    React.createElement('input', { id: 'domoPower', type: 'text', name: 'power', placeholder: 'Domo Power' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'form',
        { id: 'domoSortForm',
          onSubmit: sortDomos,
          name: 'domoSortForm',
          className: 'domoSortForm' },
        React.createElement(
          'label',
          { htmlFor: 'sort' },
          'Sort: '
        ),
        React.createElement(
          'select',
          { name: 'sort', id: 'sortSelect' },
          React.createElement(
            'option',
            { value: 'age_ascending' },
            'Age, ascending'
          ),
          React.createElement(
            'option',
            { value: 'age_descending' },
            'Age, descending'
          ),
          React.createElement(
            'option',
            { value: 'power_ascending' },
            'Power, ascending'
          ),
          React.createElement(
            'option',
            { value: 'power_descending' },
            'Power, descending'
          )
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Sort' })
      ),
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No Domos yet.'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        ' Name: ',
        domo.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        ' Age: ',
        domo.age,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoPower' },
        ' Power: ',
        domo.power,
        ' '
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    React.createElement(
      'form',
      { id: 'domoSortForm',
        onSubmit: sortDomos,
        name: 'domoSortForm',
        className: 'domoSortForm' },
      React.createElement(
        'label',
        { htmlFor: 'sort' },
        'Sort: '
      ),
      React.createElement(
        'select',
        { name: 'sort', id: 'sortSelect' },
        React.createElement(
          'option',
          { value: 'age_ascending' },
          'Age, ascending'
        ),
        React.createElement(
          'option',
          { value: 'age_descending' },
          'Age, descending'
        ),
        React.createElement(
          'option',
          { value: 'power_ascending' },
          'Power, ascending'
        ),
        React.createElement(
          'option',
          { value: 'power_descending' },
          'Power, descending'
        )
      ),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
      React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Sort' })
    ),
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector('#domos'));
  });
};

var loadSortedDomosFromServer = function loadSortedDomosFromServer() {
  var input = $('#sortSelect').val();

  var data = {
    sort: "age",
    direction: "ascending"
  };

  if (input === 'age_ascending') {
    data.sort = 'age';
    data.direction = 'ascending';
  } else if (input === 'age_descending') {
    data.sort = 'age';
    data.direction = 'descending';
  } else if (input === 'power_ascending') {
    data.sort = 'power';
    data.direction = 'ascending';
  } else if (input === 'power_descending') {
    data.sort = 'power';
    data.direction = 'descending';
  }

  var sendData = $.param(data);

  sendAjax('GET', '/sortDomos', sendData, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector('#domos'));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector('#makeDomo'));

  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector('#domos'));

  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', 'getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
