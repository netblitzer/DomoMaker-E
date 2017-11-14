const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.power) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    power: req.body.power,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'RAWR! Domo already exists!' });
    }

    return res.status(400).json({ error: 'RAWR! An error occurred!' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }

    return res.json({ domos: docs });
  });
};

const sortDomos = (request, response) => {
  const req = request;
  const res = response;
  const sort = req.query.sort;
  const dir = req.query.direction;
  
  if (sort === 'age') {
    return Domo.DomoModel.sortByAge(req.session.account._id, dir, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      }

      return res.json({ domos: docs });
    });
  } else {
    return Domo.DomoModel.sortByPower(req.session.account._id, dir, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      }

      return res.json({ domos: docs });
    });
  }
};

module.exports = {
  makerPage,
  make: makeDomo,
  getDomos,
  sortDomos,
};
