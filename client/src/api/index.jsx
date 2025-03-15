import { registerUser, loginUser, ResetPassword } from "./authApi.jsx";
import { fetchUserProfile } from "./userApi.jsx";
import {
  fetchQuizQuestions,
  getQuestions,
  addQuestion,
  deleteQuestion,
} from "./quizApi.jsx";

export {
  registerUser,
  loginUser,
  fetchUserProfile,
  ResetPassword,
  //
  fetchQuizQuestions,
  getQuestions,
  addQuestion,
  deleteQuestion,
};
