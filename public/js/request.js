let arr = [], obj = {'category':arr};
let tokens = document.querySelector('[name="WS_tokens"]').getAttribute('content'),
    params = JSON.parse(tokens)

async function getCategories (parent = null) {
    document.querySelector('.container .topContent h4').innerHTML = parent ? 'Selecione a subcategoria' : 'Selecione a categoria'

    if (!parent) {
      arr = []
    }

  document.querySelector('#categories').classList.add('loading')
  
  let url = new URL(location.protocol + '//' + location.host + "/product/config/categories");
  params['parent'] = parent
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  let response = await fetch(url)
  let data = await response.json()

  if(data.length == 0 || !data || data == '' || data == false || data == undefined) {
    document.querySelector('#nextStep').disabled = false;
    document.querySelector('#categories .loading').classList.remove('loading');
    document.querySelector('#categories').classList.remove('loading');
    document.querySelector('#breadcrumb').setAttribute('data-last', true);
  } else {
    document.querySelector('#nextStep').disabled = true;
    document.querySelector('#breadcrumb').setAttribute('data-last', false);
    document.querySelector('#categories').innerHTML = ''
    document.querySelector('#categories').classList.remove('loading');
    data.forEach(value => {
      let newDiv = document.createElement('div')
        newDiv.innerHTML = '<a href="javascript: selectCate('+value.CategoryId+')">'+ value.Name +'</a>'
        newDiv.setAttribute('class', '_item')
        newDiv.setAttribute('data-id', value.CategoryId)
      document.querySelector('#categories').append(newDiv);
    });
  }
}

function backCat(removeId) {
  let removeAll = false;
  document.querySelectorAll('#breadcrumb > *').forEach(elm => {
    if (removeAll) elm.remove()
    if (elm.getAttribute('cat-id') == removeId) removeAll = !removeAll
  })
  
  arr.splice(arr.indexOf(removeId)+1, arr.length - arr.indexOf(removeId) +1)
  obj['category'] = arr
  document.querySelector('.container .list').innerHTML = ''
  getCategories(removeId);
}

function selectCate(category_id) {
  let element = document.querySelector('.container .list ._item[data-id="'+category_id+'"]');
  
 if (element.classList.contains('active')) return

  document.querySelectorAll('.container .list ._item').forEach(itm => itm.classList.remove('active'))

  element.classList.add('loading', 'active')

  if (document.querySelector('#breadcrumb').getAttribute('data-last') == 'true') {
      document.querySelector('#breadcrumb .item:last-child').innerHTML = element.innerText;
  } else {
    let itens, lastFather = null;
    if (arr.length > 0) {
      document.querySelector('#breadcrumb').innerHTML += '<span>></span>'
      itens = document.querySelectorAll('#breadcrumb .item')
      lastFather = itens[itens.length - 1].getAttribute('cat-id')
    }
    document.querySelector('#breadcrumb').innerHTML += `<span class='item' cat-id='${category_id}' onclick='${arr.length == 0 ? 'document.querySelector("#breadcrumb").innerHTML = "<span>Categoria selecionada:</span>";getCategories()' : `backCat(${lastFather})`}'> ${element.innerText} </span>`;
  }

  arr.push(category_id);
  getCategories(category_id);
}

async function brandConditionList() {
  document.querySelector('#breadcrumb').classList.add('none')
  document.querySelector('.loading-container').classList.remove('none')
  document.querySelector('#categories').classList.add('none')
 
  document.querySelector('h4').innerHTML = 'Configure as opções do seu produto'

  let url = new URL(location.protocol + '//' + location.host + "/product/config/brands");

  document.querySelector('#nextStep').disabled = true;
  document.querySelector('#nextStep').setAttribute('onclick', 'attributeList()')
  
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  let response = await fetch(url)
  let data = await response.json()

  let strToAppend = ''

  data.forEach(value => {
    strToAppend += '<option data-value=' + value.Name + ' value=' + value.Name + '>'
  })

  let datalist = document.querySelector('.brands-list'),
    inpt = document.querySelector('#brand')

  datalist.innerHTML = strToAppend

  document.querySelector('.loading-container').classList.add('none')
  document.querySelector('#configuracao').classList.remove('none')

  inpt.addEventListener("keyup", (e) => {
    if (e.target.value.length >= 2) {
        datalist.setAttribute("id", "brands");
    } else {
        datalist.setAttribute("id", "");
    }
  });

  let eventSource, value = '';

  inpt.addEventListener('keydown', (e) => {
    eventSource = e.key ? 'input' : 'list';
  });

  inpt.addEventListener('input', (e) => {
    shownVal = e.target.value;
    if (eventSource === 'list') {
      obj['brand'] = document.querySelector("#brands option[value='"+shownVal+"']").dataset.value;
      document.querySelector('#nextStep').disabled = false;
    } else {
      document.querySelector('#nextStep').disabled = true;
    }
  });
}

async function attributeList() {
  let url = new URL(location.protocol + '//' + location.host + "/product/config/configAttributes");

  document.querySelector('h4').innerHTML = 'Informe os atributos do produto: <br><span id="titleProdSku"></span>'

  params['parent'] = arr[arr.length-1]
  
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  let response = await fetch(url)
  let data = await response.json()

  console.log(data)

  if (data.length == 0 || !data || !Array.isArray(data)) finalizar()

  let query = (new URL(document.location)).searchParams;
  let prod = JSON.parse(query.get('PROD_DADOS'))

  obj['attr'] = data

  obj['attr'].forEach(objAttr => {
    objAttr['response'] = {}
  })

  console.log(data)

  document.querySelector('#configuracao').innerHTML = ''

  displayAttributes(JSON.stringify(data), JSON.stringify(prod))
}

function displayAttributes(data, prod, i = 0) {
  document.querySelector('#configuracao').innerHTML = ''
  prod = JSON.parse(prod)
  data = JSON.parse(data)

  skuData = prod.variacoes && prod.variacoes != 0 | '' | [] ? prod.variacoes[i].sku : prod.sku

  document.querySelector('#titleProdSku').innerHTML = skuData
  data.forEach(elm => {
    let newLabel = document.createElement('h4')
        newLabel.innerHTML = `${elm.Label} <span class="sub sub-mandatory"></span>`
    let newDiv = document.createElement('div'),
        newPut = document.createElement('input')
        newPut.setAttribute('list', elm.Name)
        newPut.setAttribute('id', elm.Label)
        newPut.setAttribute('oninput', 'verifyAttributes()')

    let newDataList = document.createElement('datalist')
        newDataList.setAttribute('id', elm.Name)
        newDataList.setAttribute('class', 'attribute-list')

        elm.Options.Option.forEach(opt => {
          newDataList.innerHTML += 
          `<option data-value="${opt.Name}" value="${opt.Name}" onclick="alert('a')"></option>`
        })

        newDiv.append(newPut)
        newDiv.append(newDataList)
      
    document.querySelector('#configuracao').append(newLabel)              
    document.querySelector('#configuracao').append(newDiv)
  })

  document.querySelector('#nextStep').setAttribute('onclick', `saveAttributes('${skuData}');finalizar()`)
  document.querySelector('#nextStep').innerHTML = "Finalizar"

  if (prod.variacoes && prod.variacoes != 0 | '' | []) {
    if (prod.variacoes[i+1]) {
      document.querySelector('#nextStep').setAttribute('onclick', `saveAttributes('${skuData}');displayAttributes('${JSON.stringify(data)}', '${JSON.stringify(prod)}', ${i+1});`)
      document.querySelector('#nextStep').innerHTML = "Próximo"
    }
  }

  document.querySelector('#nextStep').setAttribute('disabled', 'true')
}

function saveAttributes(sku) {
  
  let divs = document.querySelectorAll('#configuracao > div')

      divs.forEach(elm => {
        let val = elm.querySelector('input').value
        elm.querySelectorAll('datalist > *').forEach(opt => {
          if (opt.value == val) {
            obj['attr'].forEach(attr => {
              if (attr.Label == elm.querySelector('input').getAttribute('id')) {
                attr.response[sku] = opt.getAttribute('data-value')
              }
            })
          }
        })
      })
}

function verifyAttributes() {
  let responseTrue = 0;
  let divs = document.querySelectorAll('#configuracao > div'),
      numDivs = divs.length

  divs.forEach(elm => {
    if (numDivs == responseTrue) return true
    let val = elm.querySelector('input').value
    elm.querySelectorAll('datalist > *').forEach(opt => {
      if (opt.value == val) responseTrue++;
    })
  })

  if (numDivs == responseTrue) {
    document.querySelector('#nextStep').removeAttribute('disabled')
  } else {
    document.querySelector('#nextStep').setAttribute('disabled', 'true')
  }
}

function finalizar() {
  obj['category'] = arr
  obj['attr'].forEach(attribute => {
    Object.keys(attribute).forEach(columname => {
        if (columname != 'FeedName' && columname != 'response') delete attribute[columname]
    })
  })
  let json = JSON.stringify(obj),
      urlRetorno = document.querySelector('[name="urlRetorno"]').getAttribute('content');

    let form = document.createElement('form')
    form.setAttribute('action', urlRetorno)
    form.setAttribute('method', 'post')
    form.innerHTML = '<textarea name="json" style="display:none;">' + json + '</textarea>';

  document.querySelector('body').innerHTML = ''
  document.querySelector('body').append(form)
  document.querySelector('form').submit()
}

getCategories();