// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companyInformationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    companyAddressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    countryName: { type: String, required: true },
    advisorName: { type: String, required: false },
    authPersonnel: [{
      id: { type: Number, required: true },  // or String, based on your requirements
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true }
    }],
    companyBankAccounts: [{
      id: { type: Number, required: true },  // or String, based on your requirements
      bank: { type: String, required: true },
      accountNumber: { type: String, required: true }
    }],
    companyInvestmentAccountNumber: { type: String }
  });

const CompanyInformation = mongoose.model('CompanyInformation', companyInformationSchema);
module.exports = CompanyInformation;
