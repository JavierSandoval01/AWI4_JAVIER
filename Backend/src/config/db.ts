import mongoose from 'mongoose';

const connectDBMongo = async (): Promise<void> => {
  const mongoUri = "mongodb://localhost:27017";

  try {
    await mongoose.connect(mongoUri);
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error en la conexión a MongoDB:", error);
  }
};

export default connectDBMongo;