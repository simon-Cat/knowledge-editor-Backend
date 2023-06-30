// подключили express
const express = require('express');
// подключили модуль fs
const fs = require('fs');

// здесь храним всю базу знаний
let baseOfKnowledge;

// чтение файла со знаниями
// сохранение в переменную baseOfKnowledge
fs.readFile('./baseOfKnowledge.json', (err, data) => {
  // если ошибка чтения
  // выбрасываем ошибку
  if (err) throw err;

  // сохранение базы знаний
  baseOfKnowledge = JSON.parse(data);
});

const PORT = 3000;
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', [
    'POST',
    'GET',
    'DELETE',
    'PATCH',
  ]);
  res.header('Access-Control-Allow-Headers', [
    'Content-Type',
    'Content-Length',
  ]);
  next();
});

// обработка get-запроса по url - "/"
// отправляем всю базу знаний на клиент
app.get('/', (req, res) => {
  res.send(baseOfKnowledge);
});

// удаление элемента базы знаний
app.delete('/', function (req, res) {
  // переменная для хранения данных
  // от клиента
  let chunked = '';
  // ждем, когда данные придут
  req.on('data', (chunk) => {
    chunked += chunk;
  });
  // данные пришли
  req.on('end', () => {
    // получаем id конкретноы
    // базы знаний
    const { id } = JSON.parse(chunked);

    // индеск элемента в базе знаний
    const index = baseOfKnowledge.findIndex((element) => element.id === id);

    // удаляем базу знаний по индексу index
    baseOfKnowledge.splice(index, 1);

    // создаем копию всей базы знаний
    // переводим в фромат JSON
    const copyOfBaseOfKnowedge = JSON.stringify(baseOfKnowledge);

    // записываем новые данные в файл с базой знаний
    fs.writeFile('./baseOfKnowledge.json', copyOfBaseOfKnowedge, (err) => {
      if (err) {
        console.log(err.message);
      }
    });

    // отправляем клиенту
    // обновленные данные базы знаний
    res.send(baseOfKnowledge);
  });
});

// добавление нового элемента базы знаний
app.post('/', function (req, res) {
  // переменная для хранения данных
  // от клиента
  let chunked = '';
  // ждем, когда данные придут
  req.on('data', (chunk) => {
    chunked += chunk;
  });
  // данные пришли
  req.on('end', () => {
    // получаем новую базу знаний
    // в формате объекта js
    const newBaseOfKnowledge = JSON.parse(chunked);

    // добавляем новый элемент
    // в базу знаний
    baseOfKnowledge.push(newBaseOfKnowledge);

    // создаем копию всей базы знаний
    // переводим в фромат JSON
    const copyOfBaseOfKnowedge = JSON.stringify(baseOfKnowledge);

    // записываем новые данные в файл с базой знаний
    fs.writeFile('./baseOfKnowledge.json', copyOfBaseOfKnowedge, (err) => {
      if (err) {
        console.log(err.message);
      }

      // отправляем клиенту
      // обновленные данные базы знаний
      res.send(baseOfKnowledge);
    });
  });
});

// изменение значений,
// добавление и удаление полей
// элемента знаний
app.patch('/', function (req, res) {
  // переменная для хранения данных
  // от клиента
  let chunked = '';
  // // ждем, когда данные придут
  req.on('data', (chunk) => {
    chunked += chunk;
  });
  // // данные пришли
  req.on('end', () => {
    // получаем обновление для определенной базы знаний
    // в формате объекта js
    const newBaseOfKnowledge = JSON.parse(chunked);

    // находим индекс обновляемого
    // элемента базы знаний
    const index = baseOfKnowledge.findIndex(
      (element) => element.id === newBaseOfKnowledge.id
    );

    // обновляем элемент
    // базы знаний по индексу index
    baseOfKnowledge[index] = newBaseOfKnowledge;

    // создаем копию всей базы знаний
    // переводим в фромат JSON
    const copyOfBaseOfKnowedge = JSON.stringify(baseOfKnowledge);

    // записываем новые данные в файл с базой знаний
    fs.writeFile('./baseOfKnowledge.json', copyOfBaseOfKnowedge, (err) => {
      if (err) {
        console.log(err.message);
      }

      // отправляем клиенту
      // обновленные данные базы знаний
      res.send(baseOfKnowledge);
    });
  });
});

app.listen(PORT, () => {
  console.log('listen port ' + PORT);
});
