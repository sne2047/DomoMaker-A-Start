const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  // check that we actually have the required info
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required!' });
  }

  // data for new domo
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  // make our new domo
  const newDomo = new Domo.DomoModel(domoData);

  // set up the promise & add the appropriate functions
  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Domo already exists' });
      }
      return res.status(400).json({ error: 'An error occured' });
    });

  // and return
  return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
