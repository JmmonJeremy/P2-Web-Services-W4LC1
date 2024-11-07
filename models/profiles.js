module.exports = (mongoose) => {
  const Profile = mongoose.model(
    'Profile',
    mongoose.Schema(
      {
        username: { type: String, unique: true },
        motto: String, 
        firstName: String,
        middleName: String,
        lastName: String,
        idol: String,
        photo: { type: String }, // Store Base64 image as a string        
      },
      { timestamps: true }
    ),
    'Profile'  // Explicitly specify the collection name
  );

  return Profile;
};
