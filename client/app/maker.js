const handleDomo = (e) => {
  e.preventDefault();
  
  $('#domoMessage').animate({ width: 'hide' }, 350);
  
  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domoPower').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }
  
  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), () => {
    loadDomosFromServer();
  });
  
  return false;
};

const sortDomos = (e) => {
  e.preventDefault();
    
  loadSortedDomosFromServer();
  
  return false;
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/maker"
          method="POST"
          className="domoForm">
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
      <label htmlFor="power">Power: </label>
      <input id="domoPower" type="text" name="power" placeholder="Domo Power" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const DomoList = (props) => {
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <form id="domoSortForm"
              onSubmit={sortDomos}
              name="domoSortForm"
              className="domoSortForm">
          <label htmlFor="sort">Sort: </label>
          <select name="sort" id="sortSelect">
            <option value="age_ascending">Age, ascending</option>
            <option value="age_descending">Age, descending</option>
            <option value="power_ascending">Power, ascending</option>
            <option value="power_descending">Power, descending</option>
          </select>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input className="makeDomoSubmit" type="submit" value="Sort" />
        </form>
        <h3 className="emptyDomo">No Domos yet.</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map((domo) => {
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 className="domoAge"> Age: {domo.age} </h3>
        <h3 className="domoPower"> Power: {domo.power} </h3>
      </div>
    );
  });
  
  return (
    <div className="domoList">
      <form id="domoSortForm"
            onSubmit={sortDomos}
            name="domoSortForm"
            className="domoSortForm">
        <label htmlFor="sort">Sort: </label>
        <select name="sort" id="sortSelect">
          <option value="age_ascending">Age, ascending</option>
          <option value="age_descending">Age, descending</option>
          <option value="power_ascending">Power, ascending</option>
          <option value="power_descending">Power, descending</option>
        </select>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Sort" />
      </form>
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />,
      document.querySelector('#domos'),
    );
  });
};

const loadSortedDomosFromServer = () => {
  const input = $('#sortSelect').val();
  
  const data = {
    sort: "age",
    direction: "ascending",
  };
  
  if (input === 'age_ascending') {
    data.sort = 'age';
    data.direction = 'ascending'
  } else if (input === 'age_descending') {
    data.sort = 'age';
    data.direction = 'descending'
  } else if (input === 'power_ascending') {
    data.sort = 'power';
    data.direction = 'ascending'
  } else if (input === 'power_descending') {
    data.sort = 'power';
    data.direction = 'descending'
  }
  
  const sendData = $.param(data);
  
  sendAjax('GET', '/sortDomos', sendData, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />,
      document.querySelector('#domos'),
    );
  });
};

const setup = (csrf) => {
  ReactDOM.render(
    <DomoForm csrf={csrf} />,
    document.querySelector('#makeDomo'),
  );
  
  ReactDOM.render(
    <DomoList domos={[]} />,
    document.querySelector('#domos'),
  );
  
  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', 'getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});