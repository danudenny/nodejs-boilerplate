const db = require("../../database/models");
const District = db.districts;
const { success, error, validation } = require("../middleware/responseApi");
const Op = db.Sequelize.Op;
const buildPaginator = require('pagination-apis');

function getDistrictQueryFilter(req) {
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
    url: `${req.protocol}://${req.get('host')}/api/districts`,
    limit: (!req.query.limit) ? parseInt(req.query.limit) : 10,
    page: parseInt(req.query.page)
  });

  const {count, rows} = await District.findAndCountAll({
    page,
    limit,
    offset: skip,
    where: getDistrictQueryFilter(req),
  });
  if (Object.keys({count, rows}).length === 0) {
    res
      .status(400)
      .json(error("No District Available", res.statusCode));
  }
  res
    .status(200)
    .json(success("Success Get District Data", paginate(rows, count), res.statusCode));
}

exports.create = async (req, res) => {
  const findDistrictName = await District.findOne({
    where: {
      name: req.body.name
    }
  })
  if(findDistrictName) {
    res
      .status(400)
      .json(error(`District Name '${req.body.name}' is already exist`, res.statusCode));
  }

  const payload = {
    name: req.body.name,
    code: req.body.code
  }

  try {
    const createDistrict = await District.create(payload)
    res
      .status(200)
      .json(success("Success Create District", createDistrict, res.statusCode));

  } catch (err) {
    res
      .status(400)
      .json(error(`Failed create District`, res.statusCode, err.message));
  }

}

exports.find = async (req, res) => {
  const getDistrict = await District.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!getDistrict) {
    res
      .status(400)
      .json(success(`No District with ID '${req.params.id}' found`, res.statusCode));
  }

  res
    .status(200)
    .json(success("Success Find District", getDistrict, res.statusCode));
}

exports.update = async (req, res) => {
  const payload = {
    name: req.body.name,
    code: req.body.code
  }
  try {
    const updateDistrict = await District.update(payload, {
      where: {
        id: req.params.id
      }
    })

    console.log(updateDistrict[0] === 0)
    if(updateDistrict[0] === 0) {
      res
        .status(400)
        .json(success(`No District with ID '${req.params.id}' found`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Update District", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update District`, res.statusCode, err.message));
  }
}

exports.delete = async (req, res) => {
  try {
    await District.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        if (!result) {
          res
            .status(400)
            .json(error(`No District with ID '${req.params.id}' found`, res.statusCode));
        }
        res
          .status(200)
          .json(success("Success Delete District", res.statusCode));
      })
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed delete District`, res.statusCode, err.message));
  }

}
