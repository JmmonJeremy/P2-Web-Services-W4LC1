// google auth 
const AutoIncrement = require('mongoose-sequence'); // Make sure AutoIncrement is required

module.exports = (mongoose) => {
  const CreationGoalSchema = new mongoose.Schema(
      {
        creationNumber: { 
          type: Number, 
          unique: true 
        },
        motivator: {
          type: String,
          required: true
        },
        desire: {
          type: String,
          required: true
        },
        belief: {
          type: String,
          required: true
        },
        knowledge: {
          type: String,
          required: true
        },
        goal: {
          type: String,
          required: true
        },
        plan: {
          type: String,
          required: true
        },   
        action: {
          type: String,
          required: true
        },
        victory: {
          type: String,
          required: true
        },
        status: {
          type: String,
          default: 'private',
          enum: ['public', 'private']
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        creationDate: { 
          type: Date, 
          default: Date.now 
        },       
      },
      { timestamps: true }
    );

  // Apply the auto-increment plugin
  // CreationGoalSchema.plugin(AutoIncrement(mongoose), { inc_field: 'creationNumber' });
  // Pre-save hook to set creationNumber and ensure creationDate is in the correct format
  CreationGoalSchema.pre('save', async function (next) {
    try {
      let potentialNumber;
  
      // Check if a creationNumber is provided
      if (this.creationNumber) {
        potentialNumber = this.creationNumber;
  
        // Check if the provided creationNumber exists in the database
        let exists = await mongoose.model('creationGoal').findOne({ creationNumber: potentialNumber });
  
        if (exists) {
          // If the provided number exists, calculate count + 1 as the fallback
          const count = await mongoose.model('creationGoal').countDocuments();
          potentialNumber = count + 1;
        }
      } else {
        // No creationNumber provided, calculate count + 1 directly
        const count = await mongoose.model('creationGoal').countDocuments();
        potentialNumber = count + 1;
      }
  
      // Now check if potentialNumber (whether calculated or fallback) exists
      let exists = await mongoose.model('creationGoal').findOne({ creationNumber: potentialNumber });
      while (exists) {
        // If the calculated or fallback number exists, increment until a unique number is found
        potentialNumber += 1;
        exists = await mongoose.model('creationGoal').findOne({ creationNumber: potentialNumber });
      }
  
      // Assign the unique number to this.creationNumber
      this.creationNumber = potentialNumber;
  
      // Handle the creationDate similarly
      if (this.creationDate && typeof this.creationDate === 'string') {
        const parsedDate = new Date(this.creationDate);
  
        if (!isNaN(parsedDate.getTime())) {
          this.creationDate = parsedDate.toISOString();
        } else {
          this.creationDate = new Date().toISOString();
        }
      } else if (!this.creationDate) {
        this.creationDate = new Date().toISOString();
      }
  
      next(); // Proceed with saving the document
    } catch (error) {
      next(error); // Handle error if something goes wrong
    }
  });
  

  // Explicitly specify the collection name
  const CreationGoal = mongoose.model('CreationGoal', CreationGoalSchema, 'CreationGoal');
  module.exports = CreationGoal;
  return CreationGoal;
};
