const db = require("../../database/models");
const City = db.cities;
const { success, error, validation } = require("../middleware/responseApi");
const Op = db.Sequelize.Op;
const buildPaginator = require('pagination-apis');

function getCityQueryFilter(req) {
  let whereConditions = {};
  if (req.query.name) {
    whereConditions.name = {
      [Op.like]: '%' + (req.query.name) + '%'
    }
  }
  return whereConditions;
}

exports.list = async (req, res) => {
  const { page, limit, skip, paginate } = buildPaginator({
    url: `${req.protocol}://${req.get('host')}/api/cities`,
    limit: (!req.query.limit) ? parseInt(req.query.limit) : 10,
    page: parseInt(req.query.page)
  });

  const {count, rows} = await City.findAndCountAll({
    page,
    limit,
    offset: skip,
    where: getCityQueryFilter(req),
  });
  if (Object.keys({count, rows}).length === 0) {
    res
      .status(400)
      .json(error("No City Available", res.statusCode));
  }
  res
    .status(200)
    .json(success("Success Get City Data", paginate(rows, count), res.statusCode));
}

exports.create = async (req, res) => {
  const findCityName = await City.findOne({
    where: {
      name: req.body.name
    }
  })
  if(findCityName) {
    res
      .status(400)
      .json(error(`City Name '${req.body.name}' is already exist`, res.statusCode));
  }

  const payload = {
    name: req.body.name,
    code: req.body.code
  }

  try {
    const createCity = await City.create(payload)
    res
      .status(200)
      .json(success("Success Create City", createCity, res.statusCode));

  } catch (err) {
    res
      .status(400)
      .json(error(`Failed create City`, res.statusCode, err.message));
  }

}

exports.find = async (req, res) => {
  const getCity = await City.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!getCity) {
    res
      .status(400)
      .json(success(`No City with ID '${req.params.id}' found`, res.statusCode));
  }

  res
    .status(200)
    .json(success("Success Find City", getCity, res.statusCode));
}

exports.update = async (req, res) => {
  const payload = {
    name: req.body.name,
    code: req.body.code
  }
  try {
    const updateCity = await City.update(payload, {
      where: {
        id: req.params.id
      }
    })

    console.log(updateCity[0] === 0)
    if(updateCity[0] === 0) {
      res
        .status(400)
        .json(success(`No City with ID '${req.params.id}' found`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Update City", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update City`, res.statusCode, err.message));
  }
}

exports.delete = async (req, res) => {
  try {
    await City.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        if (!result) {
          res
            .status(400)
            .json(error(`No City with ID '${req.params.id}' found`, res.statusCode));
        }
        res
          .status(200)
          .json(success("Success Delete City", res.statusCode));
      })
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed delete City`, res.statusCode, err.message));
  }

}
