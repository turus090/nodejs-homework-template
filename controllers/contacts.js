const ContactsModel = require("../schemas/constacts");

const getList = async (req, res, next) => {
  const list = await ContactsModel.find();
  if (list) {
    res.status(200).json(list);
  } else {
    res.status(500).json({ message: "Error" });
  }
};

const getById = async (req, res, next) => {
  const itemCandidate = await ContactsModel.findById(req.params.contactId);
  if (itemCandidate) {
    res.status(200).json(itemCandidate);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

const createNewContact = async (req, res, next) => {
  const newContact = new ContactsModel({
    ...req.body,
  });
  try {
    await newContact.save();
    res.status(200).json(newContact);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteContact = async (req, res) => {
  try {
    await ContactsModel.deleteOne({ _id: req.params.contactId });
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const updateContact = async (req, res) => {
  try {
    await ContactsModel.findOneAndUpdate(
      {
        _id: req.params.contactId,
      },
      {
        ...req.body,
      }
    );
    res.status(200).json({ message: "Contact updated successfully" });
  } catch (Error) {
    res.status(500).json({ message: Error });
  }
};

const changeFavorites = async (req, res) => {
  try {
    const itemCandidate = await ContactsModel.findOne({
      _id: req.params.contactId,
    });
    console.log(req.params.contactId);
    if (itemCandidate) {
      await ContactsModel.findOneAndUpdate(
        {
          _id: req.params.contactId,
        },
        { favorite: !itemCandidate.favorite }
      );
      res
        .status(200)
        .json({ message: "Contact favorite updated successfully" });
    } else {
      res.status(400).json({ messsage: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports = {
  getList,
  getById,
  createNewContact,
  deleteContact,
  updateContact,
  changeFavorites,
};
