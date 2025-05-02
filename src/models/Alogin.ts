import mongoose from "mongoose";

const AdminLoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return v.endsWith('@cnru.rw');
      },
      message: function(props: any) {
        return `Invalid email: '${props.value}'. Username must end with '@cnru.rw'`;
      }
    }
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.AdminLogin || mongoose.model("AdminLogin", AdminLoginSchema);
export interface IAdminLogin extends mongoose.Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IAdminLoginInput { 
  username: string;
  password: string;
}
export interface IAdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: IAdminLogin;
}
export interface IAdminLoginError {
  success: boolean;
  message: string;
  error?: string;
}
export interface IAdminLoginRequest {
  username: string;
  password: string;
}
  


