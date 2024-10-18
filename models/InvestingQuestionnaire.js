// models/User.js
const mongoose = require('mongoose');

const investingQuestionnaireSchema = new mongoose.Schema({
    investingQ1: { type: String, required: true },
    investingQ2: { type: String, required: true }, 
    investingQ2CashAmount: {type: String},
    investingQ2BusinessDuration: {type: String},
    investingQ2AverageCashPerYear: {type: String},
    investingQ3: {type: String, required: true},
    investingQ4: {type: String, required: true},
    investingQ4CashBackDate: {type: String},
    investingQ4CashBackDuration: {type: String},
    investingQ5: {type: String, required: true},
    investingQ6: {type: String, required: true},
    investingQ8: {type: String, required: true},
});

const InvestingQuestionnaire = mongoose.model('InvestingQuestionnaire', investingQuestionnaireSchema);
module.exports = InvestingQuestionnaire;
