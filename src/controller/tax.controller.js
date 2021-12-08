const db = require("../../database/models");
const Tax = db.taxes;
const { success, error, validation } = require("../middleware/responseApi");
const Op = db.Sequelize.Op;
const buildPaginator = require('pagination-apis');

function getTaxQueryFilter(req) {
  let whereConditions = {};
  if (req.query.name) {
    whereConditions.name = {
      [Op.like]: '%' + (req.query.name) + '%'
    }
  }
  if (req.query.type) {
    whereConditions.type = {
      [Op.like]: '%' + (req.query.type) + '%'
    }
  }
  return whereConditions;
}

exports.list = async (req, res) => {
  const { page, limit, skip, paginate } = buildPaginator({
    url: `${req.protocol}://${req.get('host')}/api/taxes`,
    limit: (!req.query.limit) ? parseInt(req.query.limit) : 10,
    page: parseInt(req.query.page)
  });

  const {count, rows} = await Tax.findAndCountAll({
    page,
    limit,
    offset: skip,
    where: getTaxQueryFilter(req),
  });
  if (Object.keys({count, rows}).length === 0) {
    res
      .status(400)
      .json(error("No Tax Available", res.statusCode));
  }
  res
    .status(200)
    .json(success("Success Get Tax Data", paginate(rows, count), res.statusCode));
}

exports.create = async (req, res) => {
  const findTaxName = await Tax.findOne({
    where: {
      name: req.body.name
    }
  })
  if(findTaxName) {
    res
      .status(400)
      .json(error(`Tax Name '${req.body.name}' is already exist`, res.statusCode));
  }
  const findTaxType = await Tax.findOne({
    where: {
      type: req.body.type
    }
  })
  if(findTaxType) {
    res
      .status(400)
      .json(error(`Tax Type '${req.body.name}' is already exist`, res.statusCode));
  }

  const payload = {
    name: req.body.name,
    type: req.body.type,
    percentage: req.body.percentage,
  }

  try {
    const createTax = await Tax.create(payload)
    res
      .status(200)
      .json(success("Success Create Tax", createTax, res.statusCode));

  } catch (err) {
    res
      .status(400)
      .json(error(`Failed create Tax`, res.statusCode, err.message));
  }

}

exports.find = async (req, res) => {
  const getTax = await Tax.findOne({
    where: {
      id: req.params.id
    }
  })
  if(!getTax) {
    res
      .status(400)
      .json(success(`No Tax with ID '${req.params.id}' found`, res.statusCode));
  }

  res
    .status(200)
    .json(success("Success Find Tax", getTax, res.statusCode));
}

exports.update = async (req, res) => {
  const payload = {
    name: req.body.name,
    type: req.body.type,
    percentage: req.body.percentage,
  }
  try {
    const updateTax = await Tax.update(payload, {
      where: {
        id: req.params.id
      }
    })

    console.log(updateTax[0] === 0)
    if(updateTax[0] === 0) {
      res
        .status(400)
        .json(success(`No Tax with ID '${req.params.id}' found`, res.statusCode));
    }
    res
      .status(200)
      .json(success("Success Update Tax", res.statusCode));
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed update Tax`, res.statusCode, err.message));
  }
}

exports.delete = async (req, res) => {
  try {
    await Tax.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        if (!result) {
          res
            .status(400)
            .json(error(`No Tax with ID '${req.params.id}' found`, res.statusCode));
        }
        res
          .status(200)
          .json(success("Success Delete Tax", res.statusCode));
      })
  } catch (err) {
    res
      .status(400)
      .json(error(`Failed delete Tax`, res.statusCode, err.message));
  }

}
