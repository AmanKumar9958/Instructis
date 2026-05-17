export const getFriendlyErrorMessage = (error) => {
  if (!error) return "";
  
  const message = typeof error === 'string' ? error : error.message || "";
  
  if (message.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized for login. Please contact Instructis support.";
  }
  if (message.includes("auth/user-not-found") || message.includes("auth/user-not-found")) {
    return "No account found with this email address.";
  }
  if (message.includes("auth/wrong-password")) {
    return "Incorrect password. Please try again.";
  }
  if (message.includes("auth/invalid-email")) {
    return "The email address you entered is invalid.";
  }
  if (message.includes("auth/network-request-failed")) {
    return "Connection error. Please check your internet and try again.";
  }
  if (message.includes("auth/popup-closed-by-user")) {
    return "Login window was closed. Please try again.";
  }
  if (message.includes("auth/too-many-requests")) {
    return "Too many failed attempts. Please try again in a few minutes.";
  }
  if (message.includes("auth/user-disabled")) {
    return "This account has been disabled. Please contact administration.";
  }
  if (message.includes("auth/operation-not-allowed")) {
    return "This login method is currently disabled.";
  }
  if (message.includes("auth/requires-recent-login")) {
    return "Please log in again to perform this sensitive action.";
  }
  
  // Return the original message if it doesn't look like a technical Firebase error
  if (!message.includes("Firebase:") && !message.includes("auth/")) {
    return message;
  }

  return "An unexpected error occurred. Please try again later.";
};
