const API_URL = 'http://apis.is/isnic?domain=';


/**
* Leit að lénum á Íslandi gegnum apis.is
*/
const program = (() => {
  let input;
  let results;
  
  function init(domains) {
    const form = domains.querySelector('form');
    input = form.querySelector('input');
    results = domains.querySelector('.results');
    
    form.addEventListener('submit', onSubmit);
  }
  
  function onSubmit(e){
    e.preventDefault();
    const len = input.value;
    
    showLoading();
    fetchResults(len);
    
  }
  
  function showLoading() {
    erase(results);
    const img = el('img');
    img.setAttribute('alt', 'loading gif');
    img.setAttribute('src', 'loading.gif');
    
    const imageDiv = el('div');
    imageDiv.classList.add('loading');
    imageDiv.appendChild(img);
    
    results.appendChild(imageDiv);
  }
  
  function showMessage(message){
    erase(results);
    txtElement = el('p', message);    
    results.appendChild(txtElement);
  }
  
  function showResults(data){
    erase(results);
    if(data[0] == undefined){
      showMessage("Lén er ekki skráð");
    }
    
    let dataObj = data[0]
    insertResults(dataObj);
  }

  function insertResults(dataObj){
    let dlElement = document.createElement('dl');
    for (let key in dataObj){
      if(key == 'domain'){
        dt = el('dt', 'Lén');
        dd = el('dd', dataObj[key]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if(key == 'registered'){
        dt = el('dt', 'Skráð');
        dd = el('dd', new Date(dataObj[key]).toISOString().split('T')[0]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if(key == 'lastChange'){
        dt = el('dt', 'Seinast breytt');
        dd = el('dd', new Date(dataObj[key]).toISOString().split('T')[0]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if(key == 'expires'){
        dt = el('dt', 'Rennur út');
        dd = el('dd', new Date(dataObj[key]).toISOString().split('T')[0]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if((key == 'registrantname') && (dataObj[key] != "")){
        dt = el('dt', 'Skráningaraðili');
        dd = el('dd', dataObj[key]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if(key == 'email' && (dataObj[key] != "")){
        dt = el('dt', 'Netfang');
        dd = el('dd', dataObj[key]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if(key == 'address' && (dataObj[key] != "")){
        dt = el('dt', 'Heimilisfang');
        dd = el('dd', dataObj[key]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
      else if(key == 'country' && (dataObj[key] != "")){
        dt = el('dt', 'Land');
        dd = el('dd', dataObj[key]);
        dlElement.appendChild(dt);
        dlElement.appendChild(dd);
      }
    }
    results.appendChild(dlElement);
  }
  
  function erase(container){
    while(container.firstChild){
      container.removeChild(container.firstChild);
    }
  }
  
  function el(type, text){
    let el = document.createElement(type);
    if(text){
      el.appendChild(document.createTextNode(text));
    }
    return el;
  }
  
  function fetchResults(len){
    fetch(`${API_URL}${len}`)
    .then( (data) =>{
      if(!data.ok) {
        throw new Error('Non 200 status');
      }
      return data.json();
    })
    .then( (data) => showResults(data.results))
    .catch( (error) => {
      console.error('ERROR', error);
      showMessage('Lén verður að vera strengur');
      if(error.name == 'TypeError'){
        showMessage('Villa við að sækja gögn')
      }
    });    
    
  }
  
  
  return {
    init,
  };
})();


document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
