const db = require("../../database/models");
const Province = db.provinces;
const { success, error, validation } = require("../middleware/responseApi");
const Op = db.Sequelize.Op;
const buildPaginator = require('pagination-apis');

function getProvinceQueryFilter(req) {
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
    url: `${req.protocol}://${req.get('host')}/api/provinces`,
    limit: (!req.query.limit) ? parseInt(req.query.limit) : 10,
    page: parseInt(req.query.page)
  });

  const {count, rows} = await Province.findAndCountAll({
    page,
    limit,
    offset: skip,
    where: getProvinceQueryFilter(req),
  });
  if (Object.keys({count, rows}).length === 0) {
    res
      .status(400)
      .json(error("No Province Available", res.statusCode));
  }
  res
    .status(200)
    .json(success("Success Get Province Data", paginate(rows, count), res.statusCode));
}

exports.create = async (req, res) => {
  const findProvinceName = await Province.findOne({
    where: {
      name: req.body.name
    }
  })
  if(findProvinceName) {
    res
      .status(400)
      .json(error(`Province Name '${req.body.name}' is already exist`, res.statusCode));
  }

  const payload = {
    name: req.body.name,
    code: req.body.code
  }

  try {
    const createProvince = await Province.create(payload)
    res
      .status(200)
      .json(success("Success Create Province", createProvince, res.statusCode));

  } catch (err) {
    res
      .status(400)
      .json(error(`Failed create Province`, res.statusCode, err.message));
  }

}

exports.find = async (req, res) => {
  const getProvince = await Province.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!getProvince) {
    res
      .status(400)
      .json(success(`No Province with ID '${req.params.id}' found`, res.statusCode));
  }

  res
    .status(200)
    .json(success("Success Find Province", getProvince, res.statusCode));
}

exports.update = async (req, res) => {
  const payload = {
    name: req.body.name,
    code: req.body.code
  }
  try {
    const updateProvince = await Province.update(payload, {
      where: {
        id: req.params.id
      }
    })

    console.log(updateProvince[0] === 0)
    if(updateProvince[0] === 0) {
      res
        .status(400)
        .json(success(`No Province with ID '${req.params.id}' found`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Update Province", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Province`, res.statusCode, err.message));
  }
}

exports.delete = async (req, res) => {
  try {
    await Province.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        if (!result) {
          res
            .status(400)
            .json(error(`No Province with ID '${req.params.id}' found`, res.statusCode));
        }
        res
          .status(200)
          .json(success("Success Delete Province", res.statusCode));
      })
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed delete Province`, res.statusCode, err.message));
  }

}
