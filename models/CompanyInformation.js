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
    authPersonnel: [{
      id: { type: Number, required: true },  // or String, based on your requirements
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true }
    }],
    companyBankAccounts: [{
      id: { type: Number, required: true },  // or String, based on your requirements
      bank: { type: String, required: true },
      accountNumber: { type: String, required: true },
      bankerName: { type: String, required: true },
      currency: { type: String, required: true },
      currentInterestRate: { type: String, required: true }
    }],
    investmentAdvisors: [{
      id: { type: Number, required: true },  
      broker: { type: String, required: true },
      investmentAccountNumber: { type: String, required: true },
      advisorName: { type: String, required: true },
      investmentCurrency: { type: String, required: true },
      investmentInterestRate:{ type: String, required: true }
    }]
  });

const CompanyInformation = mongoose.model('CompanyInformation', companyInformationSchema);
module.exports = CompanyInformation;
