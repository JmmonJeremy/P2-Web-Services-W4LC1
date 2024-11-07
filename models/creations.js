const AutoIncrement = require('mongoose-sequence'); // Make sure AutoIncrement is required

module.exports = (mongoose) => {
  const creationSchema = new mongoose.Schema(
      {
        creationNumber: { type: Number, unique: true },
        motivator: String,
        desire: String,
        belief: String,
        knowledge: String,
        goal: String,
        plan: String,   
        action: String,
        victory: String,
        creationDate: { type: Date, default: Date.now },       
      },
      { timestamps: true }
    );

  // Apply the auto-increment plugin
  // creationSchema.plugin(AutoIncrement(mongoose), { inc_field: 'creationNumber' });
  // Pre-save hook to set creationNumber and ensure creationDate is in the correct format
  creationSchema.pre('save', async function (next) {
    try {
      let potentialNumber;
  
      // Check if a creationNumber is provided
      if (this.creationNumber) {
        potentialNumber = this.creationNumber;
  
        // Check if the provided creationNumber exists in the database
        let exists = await mongoose.model('Creation').findOne({ creationNumber: potentialNumber });
  
        if (exists) {
          // If the provided number exists, calculate count + 1 as the fallback
          const count = await mongoose.model('Creation').countDocuments();
          potentialNumber = count + 1;
        }
      } else {
        // No creationNumber provided, calculate count + 1 directly
        const count = await mongoose.model('Creation').countDocuments();
        potentialNumber = count + 1;
      }
  
      // Now check if potentialNumber (whether calculated or fallback) exists
      let exists = await mongoose.model('Creation').findOne({ creationNumber: potentialNumber });
      while (exists) {
        // If the calculated or fallback number exists, increment until a unique number is found
        potentialNumber += 1;
        exists = await mongoose.model('Creation').findOne({ creationNumber: potentialNumber });
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
  const Creation = mongoose.model('Creation', creationSchema, 'Creation');

  return Creation;
};
