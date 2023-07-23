import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: 'ds2qotysb',
  api_key: '763652969974967',
  api_secret: 'dsp5X_7YygnWKtaF_yXLsHKBw_U',
});

export { cloudinary };